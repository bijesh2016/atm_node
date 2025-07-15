const LocalLevelModel = require('./local_level.model');

const localLevelController = {
  getAllLocalLevels: async (req, res, next) => {
    try {
      const filter = {};
      if (req.query.districtId) {
        filter.district = req.query.districtId;
      }
      const localLevels = await LocalLevelModel.find(filter).populate('district', 'name');
      res.json({ data: localLevels, message: 'Local levels list', status: 'SUCCESS' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = localLevelController; 