const UserModel = require('../user/user.model');
const { Status, UserRoles } = require('../../config/constant');

class AdminUserService {
  async isAdmin(userId) {
    const user = await UserModel.findById(userId).select('role');
    return user && user.role === UserRoles.ADMIN;
  }  async listUsers({ page = 1, limit = 10, search = '' }) {
    try {
      const query = {
        status: { $ne: Status.DELETED },
        $or: [
          { email: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } }
        ]
      };

      const [users, total] = await Promise.all([
        UserModel.find(query)
          .select('-password -activationToken -resetPasswordToken -resetPasswordExpires')
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        UserModel.countDocuments(query)
      ]);

      const usersWithStatus = users.map(user => ({
        ...user,
        isOnline: false
      }));

      return {
        data: usersWithStatus,
        meta: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async updateUserStatus(userId, status) {
    try {
      console.log(`[Service] Updating user ${userId} status to ${status}`);
      
      if (!userId) {
        const error = new Error('User ID is required');
        console.error('[Service] Error:', error.message);
        throw error;
      }
      
      console.log(`[Service] Received status: ${status}, Valid statuses:`, { ACTIVE: Status.ACTIVE, INACTIVE: Status.INACTIVE });
      
      if (![Status.ACTIVE, Status.INACTIVE].includes(status)) {
        const error = new Error(`Invalid status: '${status}'. Must be either '${Status.ACTIVE}' or '${Status.INACTIVE}'`);
        console.error('[Service] Error:', error.message);
        throw error;
      }

      console.log(`[Service] Finding user with ID: ${userId}`);
      const existingUser = await UserModel.findById(userId);
      if (!existingUser) {
        const error = new Error('User not found');
        console.error('[Service] Error:', error.message);
        throw error;
      }
      console.log(`[Service] Found user:`, { id: existingUser._id, currentStatus: existingUser.status, role: existingUser.role });
      
      // Check if the user is an admin
      if (existingUser.role === 'admin') {
        const error = new Error('Cannot modify admin user status');
        console.error('[Service] Error:', error.message);
        throw error;
      }

      const updateData = { 
        status,
        ...(status === Status.ACTIVE ? { 
          suspendedAt: null,
          status: Status.ACTIVE
        } : { 
          suspendedAt: new Date(),
          status: Status.INACTIVE
        })
      };

      const user = await UserModel.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password -activationToken -resetPasswordToken -resetPasswordExpires -__v');

      if (!user) {
        throw new Error('Failed to update user status');
      }

      const userObj = user.toObject();
      userObj.isOnline = false;
      
      return userObj;
    } catch (error) {
      console.error(`Error in updateUserStatus for user ${userId}:`, error);
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message).join(', ');
        throw new Error(`Validation error: ${errors}`);
      }
      
      if (error.message.includes('User not found') || 
          error.message.includes('Cannot modify admin') ||
          error.message.includes('Invalid status')) {
        throw error;
      }
      
      throw new Error(`Failed to update user status: ${error.message}`);
    }
  }
  async deleteUser(userId) {
    try {
      const isAdmin = await this.isAdmin(userId);
      if (isAdmin) {
        throw new Error('Cannot delete admin user');
      }

      const user = await UserModel.findByIdAndUpdate(
        userId,
        { 
          status: Status.DELETED, 
          deletedAt: new Date(),
          deleted: true 
        },
        { new: true }
      ).select('-password -activationToken -resetPasswordToken -resetPasswordExpires');

      if (!user) {
        throw new Error('User not found');
      }

      const userObj = user.toObject();
      userObj.isOnline = false;
      
      return userObj;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  }
}

module.exports = new AdminUserService();
