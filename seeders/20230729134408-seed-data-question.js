"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let questionData = require("./soal.json");
    questionData.forEach((e) => {
      e.testcases = JSON.stringify(e.testcases);
      e.createdAt = e.updatedAt = new Date();
    });

    // console.log(questionData);
    // questionData.forEach((e) => {
    //   e.testcases = JSON.parse(e.testcases);
    // });

    await queryInterface.bulkInsert("Questions", questionData, {});
    /**
     * Add seed commands here.
     *
     * Example:
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Questions", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
  },
};
