const BranchSvc = require("./branch.service");
const { Status } = require("../../config/constant");

class branchController {
  #BranchDetail;
  branchForHome = async (req, res, next) => {
    try {
      let filter = {
        status: Status.ACTIVE,
      };
      if (req.query["search"]) {
        filter = {
          ...filter,
          name: new RegExp(req.query.search, "i"),
        };
      }
      let { data, pagination } = await BranchSvc.getAllList(req.query, filter);
      res.json({
        data: data,
        message: "Branch List",
        status: "SUCCESS",
        options: {
          pagination,
        },
      });
    } catch (exception) {
      next(exception);
    }
  };

  listAllBranch = async (req, res, next) => {
    try {
      let filter = {};
      if (req.query["search"]) {
        filter = {
          name: new RegExp(req.query.search, "i"),
        };
      }
      let { data, pagination } = await BranchSvc.getAllList(req.query, filter);
      res.json({
        data: data,
        message: "Branch List",
        status: "SUCCESS",
        options: {
          pagination,
        },
      });
    } catch (exception) {
      next(exception);
    }
  };

  #validateBranchById = async (id) => {
    this.#BranchDetail = await BranchSvc.getSingleRowByFilter({
      _id: id,
    });
    if (!this.#BranchDetail) {
      throw {
        code: 422,
        message: "Branch doesnot exist",
        status: "NOT_FOUND",
      };
    }
  };

  branchDetailById = async (req, res, next) => {
    try {
      await this.#validateBranchById(req.params.id);
      res.json({
        data: this.#BranchDetail,
        message: "Branch detail",
        status: "SUCCESS",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  branchUpdateById = async (req, res, next) => {
    try {
      await this.#validateBranchById(req.params.id);
      let payload = await BranchSvc.transformUpdatePayload(
        req,
        this.#BranchDetail
      );
      const updateData = await BranchSvc.updateSingleDataByFilter(
        {
          _id: this.#BranchDetail._id,
        },
        payload
      );
      
      res.json({
        data: updateData,
        message: "Branch Updated",
        status: "SUCCESS",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  branchDeleteById = async (req, res, next) => {
    try {
      await this.#validateBranchById(req.params.id);
      const deleteData = await BranchSvc.deleteSingleRowByFilter({
        _id: this.#BranchDetail._id,
      });
      res.json({
        data: deleteData, 
        message: "Branch deleted",
        status: "SUCCESS",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };        

  atmsByBranchId = async (req, res, next) => {
    try { 
      await this.#validateBranchById(req.params.id);
      // For now, return empty ATMs array since we don't have ATM-branch relationship
      res.json({
        data: [], 
        message: "Branch ATMs",
        status: "SUCCESS",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  createBranch = async (req, res, next) => {
    try {
      // Transform the payload to handle the data properly
      let payload = req.body;
      
      // Normalize status to lowercase to match enum values
      if (payload.status) {
        payload.status = payload.status.toLowerCase();
      } else {
        payload.status = Status.INACTIVE;
      }
      
      // Set default services if not provided
      if (!payload.services || payload.services.length === 0) {
        payload.services = ["Loans", "Deposits"];
      }
      
      // Create the branch
      const createData = await BranchSvc.createBranch(payload);
      if (!createData) {
        throw {
          code: 422,
          message: "Branch not created",
          status: "NOT_CREATED",
        };
      }
      res.json({
        data: createData,
        message: "Branch created",
        status: "CREATED",
        options: null,
      });
    } catch (exception) {
      console.error("Branch creation error:", exception);
      next(exception);
    }
  };
}             

const branchCtrl = new branchController();
module.exports = branchCtrl;
