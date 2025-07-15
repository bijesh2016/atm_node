const BankSvc = require("./bank.service");
const { Status } = require("../../config/constant");

class bankController {
  #BankDetail;
  banksForHome = async (req, res, next) => {
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
      let { data, pagination } = await BankSvc.getAllList(req.query, filter);
      res.json({
        data: data,
        message: "Bank List",
        status: "SUCCESS",
        options: {
          pagination,
        },
      });
    } catch (exception) {
      next(exception);
    }
  };

  listAllBank = async (req, res, next) => {
    try {
      let filter = {};
      if (req.query["search"]) {
        filter = {
          name: new RegExp(req.query.search, "i"),
        };
      }
      let { data, pagination } = await BankSvc.getAllList(req.query, filter);
      res.json({
        data: data,
        message: "Bank List",
        status: "SUCCESS",
        options: {
          pagination,
        },
      });
    } catch (exception) {
      next(exception);
    }
  };

  #validateBankById = async (id) => {
    this.#BankDetail = await BankSvc.getSingleRowByFilter({
      _id: id,
    });
    if (!this.#BankDetail) {
      throw {
        code: 422,
        message: "Bank doesnot exist",
        status: "NOT_FOUND",
      };
    }
  };

  bankDetailById = async (req, res, next) => {
    try {
      await this.#validateBankById(req.params.id);
      res.json({
        data: this.#BankDetail,
        message: "Bank detail",
        status: "SUCCESS",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  bankUpdateById = async (req, res, next) => {
    try {
      await this.#validateBankById(req.params.id);
      if (!this.#BankDetail) {
        return res.status(404).json({ message: 'Bank not found' });
      }
      let payload;
      try {
        payload = await BankSvc.transformUpdatePayload(req, this.#BankDetail);
      } catch (err) {
        return res.status(400).json({ message: err.message || 'Invalid update payload' });
      }
      let updateData;
      try {
        updateData = await BankSvc.updateSingleDataByFilter(
          {
            _id: this.#BankDetail._id,
          },
          payload
        );
      } catch (err) {
        return res.status(400).json({ message: err.message || 'Failed to update bank' });
      }
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

  bankDeleteById = async (req, res, next) => {
    try {
      await this.#validateBankById(req.params.id);

      const del = await BankSvc.deleteSingleRowByFilter({
        _id: this.#BankDetail._id,
      });

      res.json({
        data: del,
        message: "Bank deleted successfully",
        status: "SUCCESS",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  branchesByBankSlug = async (req, res, next) => {
    try {
        const bank = await BankSvc.getSingleRowByFilter({
        slug: req.params.slug,
      });
      if (!bank) {
        throw {
          code: 422,
          message: "Bank not found",
          status: "NOT_FOUND",
        };
      }
        const branches = await BankSvc.getSingleRowByFilter({
        bank: bank._id,
        status: Status.ACTIVE,
      });
      res.json({
        data: branches,
        message: "Bank branches",
        status: "SUCCESS",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  createBank = async (req, res, next) => {
    try {
      // Transform the payload to handle the data properly
      let payload = req.body;
      // Normalize status to lowercase to match enum values
      if (payload.status) {
        payload.status = payload.status.toLowerCase();
      } else {
        payload.status = Status.INACTIVE;
      }
      // Set default branch if not provided
      if (!payload.branch) {
        payload.branch = "Main Branch";
      }
      // Duplicate check
      const existingBank = await BankSvc.getSingleRowByFilter({
        $or: [
          { name: payload.name },
          { code: payload.code },
          { email: payload.email }
        ]
      });
      if (existingBank) {
        return res.status(400).json({
          message: "A bank with the same name, code, or email already exists.",
          status: "DUPLICATE_BANK"
        });
      }
      // Create the bank
      const createData = await BankSvc.createBank({
        ...payload,
        code: payload.code,
      });
      if (!createData) {
        throw {
          code: 422,
          message: "Bank not created",
          status: "NOT_CREATED",
        };
      }
      res.json({
        data: createData,
        message: "Bank created",
        status: "CREATED",
        options: null,
      });
    } catch (exception) {
      console.error("Bank creation error:", exception);
      next(exception);
    }
  };

}

const bankCtrl = new bankController();
module.exports = bankCtrl;
