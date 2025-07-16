const fileUploadSvc = require("../../services/fileupload.service");
const slugify = require("slugify");
const BankModel = require("./bank.model");
const mongoose = require('mongoose');

class BankService {
  transformCreatePayload = async (req) => {
    try {
      let data = req.body;
      data.slug = slugify(data.name.replace("'", "").replace('"', ""), {
        lower: true,
      });
      // if (req.file) {
      //   data.image = await fileUploadSvc.fileupload(req.file.path, "Atm/");
      // }
      data.createdBy = req.loggedInUser._id;
      return data;
    } catch (exception) {
      throw exception;
    }
  };

  transformUpdatePayload = async (req, oldData) => {
    try {
      if (!oldData) {
        throw new Error('No existing bank data found for update.');
      }
      let data = req.body;

      if (req.file) {
        data.image = '/public/' + req.file.filename;
      } else {
        data.image = oldData.image;
      }

      // data.updatedBy = req.loggedInUser._id;
      return data;
    } catch (exception) {
      throw exception;
    }
  };

  createBank = async (payload) => {
    try {
      const Bank = new BankModel(payload);
      return await Bank.save();
    } catch (exception) {
      throw exception;
    }
  };

  getAllList = async (query, filter = {}) => {
    try {
      let limit = +query.limit || 10;
      let page = +query.page || 1;
      let skip = (page - 1) * limit;

      // Aggregation to embed branches by bank _id
      let allData = await BankModel.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: "branches", 
            localField: "_id",
            foreignField: "bank",
            as: "branches"
          }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]);

      let count = await BankModel.countDocuments(filter);
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
      let detail = await BankModel.findOne(filter)
        .populate("createdBy", ["_id", "name"])
        .populate("updatedBy", ["_id", "name"]);
      return detail;
    } catch (exception) {
      throw exception;
    }
  };

  
  updateSingleDataByFilter = async (filter, data) => {
    try {
      const update = await BankModel.findOneAndUpdate(
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
      const data = await BankModel.findOneAndDelete(filter)
      return data;
    } catch(exception) {
      throw exception
    }
  }
}


const BankSvc = new BankService()
module.exports = BankSvc