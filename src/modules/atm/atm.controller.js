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
      // Province and district validation for update
      if (!payload.province || !payload.district) {
        throw {
          code: 422,
          message: "Province and district are required",
          status: "PROVINCE_DISTRICT_REQUIRED",
        };
      }
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
      const update = await AtmSvc.updateSingleDataByFilter(
        { _id: this.#AtmDetail._id },
        { status: Status.INACTIVE }
      );
      res.json({
        data: update,
        message: "ATM marked as inactive (soft deleted)",
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
      let payload = req.body;
      // Parse numeric fields if present (handles FormData string values)
      if (payload.latitude !== undefined) payload.latitude = Number(payload.latitude);
      if (payload.longitude !== undefined) payload.longitude = Number(payload.longitude);
      if (payload.status) {
        payload.status = payload.status.toLowerCase();
      } else {
        payload.status = Status.INACTIVE;
      }
      if (!payload.branch || payload.branch.length === 0) {
        payload.branch = ["Main Branch"];
      }
      if (!payload.province || !payload.district) {
        throw {
          code: 422,
          message: "Province and district are required",
          status: "PROVINCE_DISTRICT_REQUIRED",
        };
      }
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

  /**
   * Get nearby ATMs by driving distance
   * GET /atm/nearby?lat=...&lng=...&limit=10
   */
  getNearbyATMs = async (req, res, next) => {
    try {
      const { lat, lng, limit } = req.query;
      if (!lat || !lng) {
        return res.status(400).json({ error: 'lat and lng required' });
      }
      const userCoords = { lat: parseFloat(lat), lng: parseFloat(lng) };
      const atms = await AtmSvc.getNearbyATMs(userCoords, limit ? parseInt(limit) : 10);
      res.json({ data: atms, message: 'Nearby ATMs by driving distance', status: 'SUCCESS' });
    } catch (exception) {
      next(exception);
    }
  }
}

const atmCtrl = new atmController();
module.exports = atmCtrl;
