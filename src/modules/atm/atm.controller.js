const AtmSvc = require("./atm.service");
const { Status } = require("../../config/constant");

class atmController {
  #AtmDetail;
  atmsForHome = async (req, res, next) => {
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
        message: "ATM List",
        status: "SUCCESS",
        options: {
          pagination,
        },
      });
    } catch (exception) {
      next(exception);
    }
  };
  
  listAllAtm = async (req, res, next) => {
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
        message: "ATM List",
        status: "SUCCESS",
        options: {
          pagination,
        },
      });
    } catch (exception) {
      next(exception);
    }
  };

  #validateAtmById = async (id) => {
    this.#AtmDetail = await AtmSvc.getSingleRowByFilter({
      _id: id,
    });
    if (!this.#AtmDetail) {
      throw {
        code: 422,
        message: "ATM doesnot exist",
        status: "NOT_FOUND",
      };
    }
  };

  atmDetailById = async (req, res, next) => {
    try {
      await this.#validateAtmById(req.params.id);
      res.json({
        data: this.#AtmDetail,
        message: "ATM detail",
        status: "SUCCESS",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  atmUpdateById = async (req, res, next) => {
    try {
      await this.#validateAtmById(req.params.id);
      let payload = await AtmSvc.transformUpdatePayload(req, this.#AtmDetail);
      const updateData = await AtmSvc.updateSingleDataByFilter(
        {
          _id: this.#AtmDetail._id,
        },
        payload
      );
      res.json({
        data: updateData,
        message: "Atm Updated",
        status: "SUCCESS",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  atmDeleteById = async (req, res, next) => {
    try {
      await this.#validateAtmById(req.params.id);

      const del = await AtmSvc.deleteSingleRowByFilter({
        _id: this.#AtmDetail._id,
      });

      res.json({
        data: del,
        message: "ATM deleted successfully",
        status: "SUCCESS",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  branchesByAtmSlug = async (req, res, next) => {
    try {
      this.#AtmDetail = await AtmSvc.getSingleRowByFilter({
        slug: req.params.slug,
        status: Status.ACTIVE,
      });
      if (!this.#AtmDetail) {
        throw {
          code: 422,
          message: "ATM not found",
          status: "NOT_FOUND",
        };
      }

      // For now, return empty branches array since we don't have branch-ATM relationship
      res.json({
        data: {
          detail: this.#AtmDetail,
          branches: [],
        },
        message: "ATM detail",
        status: "SUCCESS",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  createAtm = async (req, res, next) => {
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
      if (!payload.branch || payload.branch.length === 0) {
        payload.branch = ["Main Branch"];
      }
      
      // Create the ATM
      const createData = await AtmSvc.createAtm(payload);
      if (!createData) {
        throw {
          code: 422,
          message: "ATM not created",
          status: "NOT_CREATED",
        };
      }
      res.json({
        data: createData,
        message: "ATM created",
        status: "CREATED",
        options: null,
      });
    } catch (exception) {
      console.error("ATM creation error:", exception);
      next(exception);
    }
  };

}

const atmCtrl = new atmController();
module.exports = atmCtrl;
