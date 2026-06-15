# MongoDB Atlas Permissions Fix Guide

## Error: "user is not allowed to do action [find] on [atm-locator.atms]"

This error occurs because your MongoDB Atlas user doesn't have the necessary permissions.

## Solution 1: Fix Existing User Permissions

### Step 1: Access MongoDB Atlas Dashboard
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign in to your account
3. Select your cluster

### Step 2: Navigate to Database Access
1. Click on "Database Access" in the left sidebar
2. Find your database user in the list

### Step 3: Edit User Permissions
1. Click "Edit" next to your user
2. Under "Built-in Role", select "Read and write to any database"
3. Click "Update User"

## Solution 2: Create New Database User

### Step 1: Create New User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username and password

### Step 2: Set Permissions
1. Under "Built-in Role", select "Read and write to any database"
2. Click "Add User"

### Step 3: Update Environment Variables
Update your `.env` file with the new credentials:

```env
MONGODB_URL=mongodb+srv://newusername:newpassword@cluster.mongodb.net/atm-locator?retryWrites=true&w=majority
MONGODB_NAME=atm-locator
```

## Solution 3: Use Local MongoDB (Temporary)

### Step 1: Install MongoDB Locally
```bash
# Windows (using chocolatey)
choco install mongodb

# Or download from https://www.mongodb.com/try/download/community
```

### Step 2: Start MongoDB Service
```bash
# Windows
net start MongoDB

# Or run manually
mongod --dbpath C:\data\db
```

### Step 3: Update Environment Variables
```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_NAME=atm-locator
```

## Solution 4: Check Network Access

### Step 1: Verify IP Whitelist
1. Go to "Network Access" in Atlas
2. Ensure your IP address is whitelisted
3. Or add `0.0.0.0/0` for all IPs (not recommended for production)

## Verification

After applying any solution, restart your backend server and test:

```bash
cd mern_project
npm start
```

The error should be resolved and your app should work properly. 