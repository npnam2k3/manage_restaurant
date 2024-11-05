module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Roles", [
      {
        role_name: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role_name: "MANAGER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role_name: "CASHIER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role_name: "STAFF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Roles", null, {});
  },
};
