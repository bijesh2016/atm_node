const fileUploadSvc = require("../../services/fileupload.service");
const slugify = require("slugify");
const BranchModel = require("./branch.model");

class BranchService {
  transformCreatePayload = async (req) => {
    try {
      let data = req.body;
      data.slug = slugify(data.name.replace("'", "").replace('"', ""), {
        lower: true,
      });
      if (req.file) {
        data.image = '/public/' + req.file.filename;
      }
      // data.createdBy = req.loggedInUser._id;
      return data;
    } catch (exception) {
      throw exception;
    }
  };

  transformUpdatePayload = async (req, oldData) => {
    try {
      let data = req.body;
      if (req.file) {
        data.image = '/public/' + req.file.filename;
      } else {
        data.image = oldData?.image || null;
      }

      // data.updatedBy = req.loggedInUser._id;
      return data;
    } catch (exception) {
      throw exception;
    }
  };

  createBranch = async (payload) => {
    try {
      const Branch = new BranchModel(payload);
      return await Branch.save();
    } catch (exception) {
      throw exception;
    }
  };

  getAllList = async (query, filter = {}) => {
    try {
      let limit = +query.limit || 10;
      let page = +query.page || 1;
      let skip = (page - 1) * limit;

      let allData = await BranchModel.find(filter)
        .populate("createdBy", ["_id", "name"])
        .populate("updatedBy", ["_id", "name"])
        .sort({ createdAt: "desc" })
        .skip(skip)
        .limit(limit);
      let count = await BranchModel.countDocuments(filter);
      return {
        data: allData,
        pagination: {
          page: page,
          limit: limit,
          total: count,
        },
      };
    } catch (exception) {
      throw exception;
    }
  };

  getSingleRowByFilter = async (filter) => {
    try {
      let detail = await BranchModel.findOne(filter)
        .populate("createdBy", ["_id", "name"])
        .populate("updatedBy", ["_id", "name"]);
      return detail;
    } catch (exception) {
      throw exception;
    }
  };

  
  updateSingleDataByFilter = async (filter, data) => {
    try {
      const update = await BranchModel.findOneAndUpdate(
        filter,
        { $set: data },
        { new: true }
      );
      return update;
    } catch (exception) {
      throw exception;
    }
  };

  deleteSingleRowByFilter = async(filter) => {
    try {
      const data = await BranchModel.findOneAndDelete(filter)
      return data;
    } catch(exception) {
      throw exception
    }
  }
}


const BranchSvc = new BranchService()
module.exports = BranchSvc