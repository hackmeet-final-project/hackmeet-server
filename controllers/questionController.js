const { Question } = require("../models");

class QuestionController {
  static async getAll(req, res, next) {
    try {
      const questionData = await Question.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      questionData.forEach((e) => {
        e.testcases = JSON.parse(e.testcases);
      });
      res.status(200).json(questionData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = QuestionController;
