const fileUploadSvc = require("../../services/fileupload.service");
const slugify = require("slugify");
const AtmModel = require("./atm.model");
const { getDrivingDistance } = require('../../utilities/distance');

class AtmService {
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

  createAtm = async (payload) => {
    try {
      const Atm = new AtmModel(payload);
      return await Atm.save();
    } catch (exception) {
      throw exception;
    }
  };

  getAllList = async (query, filter = {}) => {
    try {
      let limit = +query.limit || 10;
      let page = +query.page || 1;
      let skip = (page - 1) * limit;

      let allData = await AtmModel.find(filter)
        .populate("createdBy", ["_id", "name"])
        .populate("updatedBy", ["_id", "name"])
        .sort({ createdAt: "desc" })
        .skip(skip)
        .limit(limit);
      let count = await AtmModel.countDocuments(filter);
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
      let detail = await AtmModel.findOne(filter)
        .populate("createdBy", ["_id", "name"])
        .populate("updatedBy", ["_id", "name"]);
      return detail;
    } catch (exception) {
      throw exception;
    }
  };

  updateSingleDataByFilter = async (filter, data) => {
    try {
      const update = await AtmModel.findOneAndUpdate(
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
      const data = await AtmModel.findOneAndDelete(filter)
      return data;
    } catch(exception) {
      throw exception
    }
  }

  /**
   * Find nearby ATMs using OpenRouteService for all travel modes
   * @param {Object} userCoords - { lat, lng }
   * @param {number} [limit=10] - max number of ATMs to return
   * @returns {Promise<Array>} - sorted list of ATMs with distances for all modes
   */
  getNearbyATMs = async (userCoords, limit = 10) => {
    try {
      const { getDistanceForAllModes } = require('../../utilities/distance');
      // Fetch all ATMs (optionally, filter by rough Haversine for performance)
      const atms = await AtmModel.find({ status: 'active' });
      // For each ATM, get distances for all modes
      const atmDistances = await Promise.all(atms.map(async (atm) => {
        const atmCoords = { lat: atm.latitude, lng: atm.longitude };
        const distances = await getDistanceForAllModes(userCoords, atmCoords);
        // Use driving-car distance for sorting, fallback to walking if not available
        const sortDistance = distances['driving-car']?.distance ?? distances['foot-walking']?.distance ?? Infinity;
        return { ...atm.toObject(), distances, sortDistance };
      }));

      
      // Sort by driving distance (or walking/cycling if not available)
      atmDistances.sort((a, b) => a.sortDistance - b.sortDistance);
      return atmDistances.slice(0, limit);
    } catch (exception) {
      throw exception;
    }
  }
}


const AtmSvc = new AtmService()
module.exports = AtmSvc