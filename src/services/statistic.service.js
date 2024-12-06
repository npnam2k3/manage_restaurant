"use strict";

const Order = require("../models/order");
const { convertToDate } = require("../utils/formatDate");

const { Op, fn, col, where, QueryTypes } = require("sequelize");
const sequelize = require("../dbs/init.mysqldb");

class StatisticService {
  // thong ke theo khoang thoi gian
  static getRevenueByTimeRange = async (startDate, endDate) => {
    const formatStartDate = convertToDate(startDate);
    const formatEndDate = convertToDate(endDate || new Date());
    const revenue = await Order.sum("total_price", {
      where: {
        [Op.and]: [
          where(fn("DATE", col("createdAt")), { [Op.gte]: formatStartDate }),
          where(fn("DATE", col("createdAt")), { [Op.lte]: formatEndDate }),
        ],
      },
      raw: true,
    });

    return {
      startDate: formatStartDate,
      endDate: formatEndDate,
      revenue: revenue || 0,
    };
  };

  // thong ke chung
  static getRevenueCommon = async () => {
    const result = await Order.sum("total_price", { raw: true });
    return { revenue: result || 0 };
  };

  // thống kê 3 món bán chạy nhất
  static statisticFoodBestSeller = async () => {
    const query = `SELECT fm.id, fm.name, SUM(oi.quantity) AS quantity
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN food_menus fm ON fm.id = oi.food_menu_id
        GROUP BY fm.id, fm.name
        ORDER BY quantity DESC
        LIMIT 3;`;
    const data = await sequelize.query(query, { type: QueryTypes.SELECT });
    return data;
  };
}

module.exports = StatisticService;
