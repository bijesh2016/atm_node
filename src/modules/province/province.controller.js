const ProvinceModel = require('./province.model');

const provinceController = {
  getAllProvinces: async (req, res, next) => {
    try {
      const provinces = await ProvinceModel.find();
      res.json({ data: provinces, message: 'Provinces list', status: 'SUCCESS' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = provinceController; 