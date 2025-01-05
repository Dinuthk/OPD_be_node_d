const Drug = require("../models/DrugModel");
const { validationResult } = require("express-validator");

const DrugController = {
  async addDrug(req, res) {
    console.log(req.body);
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //     return res.status(422).json({
    //         error: true,
    //         message: 'Validation errors',
    //         data: errors,
    //     });
    // }

    const { name, form, strength, qty, expiredate } = req.body;

    try {
      const drug = await Drug.findOne({ phone: name });

      if (drug) {
        return res.status(400).json({
          error: true,
          message: "drug already exists",
          data: null,
        });
      }

      const newdrug = new Drug({
        name,
        form,
        strength,
        qty,
        expiredate,
      });

      await newdrug.save();

      return res.status(200).json({
        error: false,
        message: "drug created successfully",
        data: newdrug,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        error: true,
        message: "drug creation failed!",
        data: null,
      });
    }
  },

  async getDrugs(request, response) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: "Validation errors",
        data: errors,
      });
    }

    try {
      const { page = 1, limit = 10, query: name } = request.query;

      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

      const query = {};
      if (name) {
        query.name = { $regex: new RegExp(name), $options: "i" };
      }

      const drugs = await Drug.find(query)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 })
        .select(["-password"]);
      const total = await Drug.countDocuments(query);

      return response.status(200).json({
        error: false,
        message: "Drug list retrived!",
        data: {
          drugs,
          total,
          limit: drugs.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch drugs list!",
        data: null,
      });
    }
  },

  async getDrug(req, res) {
    const { name } = req.params;

    try {
      const drug = await Drug.findById(name);

      if (!drug) {
        return res.status(404).json({
          error: true,
          message: "drug not found",
          data: null,
        });
      }

      return res.status(200).json({
        error: false,
        message: "drug fetched successfully",
        data: drug,
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: "Failed to fetch drug",
        data: null,
      });
    }
  },

  //update drug data

  async updateDrug(request, response, next) {
    //const errors = validationResult(request);

    // if (!errors.isEmpty()) {
    //   return response.status(422).json({
    //     error: true,
    //     message: "Validation errors",
    //     data: errors,
    //   });
    // }

    const { name, form, strength, qty, expiredate } = request.body;

    try {
      //   if (password) {
      //     await User.findByIdAndUpdate(request.params.id, {
      //       password: bcrypt.hashSync(password, 10),
      //     });
      //   }

      const drug = await Drug.findByIdAndUpdate(
        name,
        {
          name,
          form,
          strength,
          qty,
          expiredate,
        },
        { new: true }
      );

      console.log(drug);

      return response.status(200).json({
        error: false,
        message: "Drug updated!",
        data: user,
      });
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        error: true,
        message: "Failed to update drug!",
        data: null,
      });
    }
  },
};

module.exports = DrugController;
