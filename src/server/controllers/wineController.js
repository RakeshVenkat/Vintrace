/* eslint-disable no-new */
const fs = require('fs');
const path = require('path');

const AppError = require('../utils/appError');
const { getBreakdown } = require('../utils/breakdown');
const { breakdownTypes } = require('../model/breakdown');

const staticFileDirectory = path.join(process.cwd(), 'public', 'data');

/**
 * Handler function to fetch all the Wine details.
 * Looks for .json files under directory: public/data
 */
exports.getWineDetails = (req, res, next) => {
  fs.readdir(staticFileDirectory, (err, data) => {
    const errorMessage = `No JSON files found in ${staticFileDirectory} directory. There should be atleast one valid file in the format <lotCode>.json containing the wine details.`;

    if (err) {
      next(new AppError(500, errorMessage));
    }

    const dataLength = data.length;
    if (dataLength === 0) {
      next(new AppError(500, errorMessage));
    } else {
      res.send({
        length: dataLength,
        data: { lotCodes: data.map(file => file.split('.json').shift()) }
      });
    }
  });
};

/**
 * Handler function to fetch the wine detail
 * @param {req} :params id lotCode
 */
exports.getWineDetail = (req, res, next) => {
  const fileName = `${req.params.id}.json`;
  const filePath = path.join(staticFileDirectory, fileName);

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      next(new AppError(400, `Wine not found with that id: ${req.params.id}`));
    } else {
      const wineDetail = data ? JSON.parse(data) : 'No wine information available';
      res.send({
        data: { wineDetail }
      });
    }
  });
};

/**
 * Hanlder function to fetch the breakdown for a wine based on type
 * @param {req} :params id:lotcode, type: year/region/variety
 */
exports.getBreakDownByType = (req, res, next) => {
  if (!Object.values(breakdownTypes).includes(req.params.type.toLowerCase())) {
    throw new AppError(404,
      "Invalid type passed. Should be one of ['year', 'region', 'variety']");
  }

  const fileName = `${req.params.id}.json`;
  const filePath = path.join(staticFileDirectory, fileName);

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      next(new AppError(400, `Wine not found with that id: ${req.params.id}`));
    } else {
      const wineDetail = data ? JSON.parse(data) : 'No wine information available';
      res.send({
        data: getBreakdown(breakdownTypes[req.params.type.toUpperCase()], wineDetail.components)
      });
    }
  });
};
