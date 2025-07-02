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
      let { data, pagination } = await AtmSvc.getAllList(req.query, filter);
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
      let { data, pagination } = await AtmSvc.getAllList(req.query, filter);
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
      let payload = await AtmSvc.transformUpdatePayload(req, this.#BankDetail);
      const updateData = await AtmSvc.updateSingleDataByFilter(
        {
          _id: this.#BankDetail._id,
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

  bankDeleteById = async (req, res, next) => {
    try {
      await this.#validateBankById(req.params.id);

      const del = await AtmSvc.deleteSingleRowByFilter({
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
    } catch (exception) {
      next(exception);
    }
  };
}

const bankCtrl = new bankController();
module.exports = bankCtrl;
