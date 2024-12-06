"use strict";

const StatisticService = require("../services/statistic.service");
const { SuccessResponse } = require("../core/success.response");
const { MESSAGES, HTTP_STATUS_CODE } = require("../core/constant.response");

class StatisticController {
  static getRevenueByTimeRange = async (req, res) => {
    const { startDate, endDate } = req.validatedData;
    const response = await StatisticService.getRevenueByTimeRange(
      startDate,
      endDate
    );
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      response
    ).send(res);
  };

  static getRevenueCommon = async (req, res) => {
    const response = await StatisticService.getRevenueCommon();
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      response
    ).send(res);
  };

  static statisticFoodBestSeller = async (req, res) => {
    const response = await StatisticService.statisticFoodBestSeller();
    new SuccessResponse(
      MESSAGES.SUCCESS.GET,
      HTTP_STATUS_CODE.OK,
      response
    ).send(res);
  };
}

module.exports = StatisticController;
