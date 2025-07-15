const DistrictModel = require('./district.model');

const districtController = {
  getAllDistricts: async (req, res, next) => {
    try {
      const filter = {};
      if (req.query.provinceId) {
        filter.province = req.query.provinceId;
      }
      const districts = await DistrictModel.find(filter).populate('province', 'name');
      res.json({ data: districts, message: 'Districts list', status: 'SUCCESS' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = districtController; 