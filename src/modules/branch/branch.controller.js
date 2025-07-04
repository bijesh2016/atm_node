const BankSvc = require("../bank/bank.service");

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
      let { data, pagination } = await Svc.getAllList(req.query, filter);
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
      let { data, pagination } = await AtmSvc.getAllList(req.query, filter);
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
    this.#BranchDetail = await BankSvc.getSingleRowByFilter({
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
        option: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  branchUpdateById = async (req, res, next) => {
    try {
      await this.#validateBranchById(req.params.id);
      let payload = await BankSvc.transformUpdatePayload(
        req,
        this.#BranchDetail
      );
      const updateData = await BankSvc.updateSingleDataByFilter(
        {
          _id: this.#BranchDetail._id,
        },
        payload
      );
      
      res.json({
        data: updateData,
        message: "Bank Updated",
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
      const deleteData = await BankSvc.deleteSingleDataByFilter({
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
      const deleteData = await BankSvc.deleteSingleDataByFilter({
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

  createBranch = async (req, res, next) => {
    try {
      const createData = await BankSvc.createSingleData(req.body);
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
      next(exception);
    }
  };
}             

const branchCtrl = new branchController();
module.exports = branchCtrl;
