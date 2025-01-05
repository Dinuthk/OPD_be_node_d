const User = require("../models/UserModel");
const Role = require("../models/RoleModel");
const bcrypt = require("bcrypt");
const { AccountStatus } = require("../../../config/constants");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");
const FileService = require("../../media/services/FileService");

const UserController = {
  async index(request, response) {
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

      const users = await User.find(query)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 })
        .select(["-password"]);
      const total = await User.countDocuments(query);

      return response.status(200).json({
        error: false,
        message: "User list retrived!",
        data: {
          users,
          total,
          limit: users.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch users list!",
        data: null,
      });
    }
  },

  async create(request, response, next) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: "Validation errors",
        data: errors,
      });
    }
    const {
      name,
      email,
      password,
      phone,
      dateOfBirth,
      address,
      startDate,
      note,
      jobRole,
    } = request.body;

    const file = request.file;
    try {
      const user = await User.findOne({ email: email });

      if (user) {
        return response.status(400).json({
          error: true,
          message: "Email already using.",
          data: null,
        });
      }

      let fileUrl = null;
      if (file) {
        const uploadResult = await FileService.uploadFile(request, response);
        console.log("uploadResult", uploadResult);

        if (uploadResult.error) {
          throw new Error(uploadResult.message);
        }
        fileUrl = uploadResult.data.file_url;
      }

      const newUser = await User({
        _id: new mongoose.Types.ObjectId(),
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        phone,
        dateOfBirth,
        address,
        startDate,
        note,
        jobRole,
        photo: fileUrl,
      }).save();

      console.log("User created:", newUser);

      return response.status(200).json({
        error: false,
        message: 'User created!',
        data: newUser,
    });
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        error: true,
        message: "Registration Failed!",
        data: null,
      });
    }
  },

  async show(request, response, next) {
    try {
      const user = await User.findById(request.params.id).select(["-password"]);

      return response.status(200).json({
        error: false,
        message: "User retrived!",
        data: user,
      });
    } catch (error) {
      return response.status(400).json({
        error: true,
        message: "Failed to fetch user!",
        data: null,
      });
    }
  },

  async update(request, response, next) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: "Validation errors",
        data: errors,
      });
    }

    const {
      name,
      email,
      password,
      phone,
      dateOfBirth,
      address,
      startDate,
      note,
      jobRole,
      photo,
    } = request.body;

    const file = request.file;

    try {

      if (password) {
        await User.findByIdAndUpdate(request.params.id, {
          password: bcrypt.hashSync(password, 10),
        });
      }

      // if (photo) {
      //   await User.findByIdAndUpdate(request.params.id, {
      //     photo: photo,
      //   });
      // }

      let fileUrl = null;
      if (file) {
        const uploadResult = await FileService.uploadFile(request, response);
        // console.log("uploadResult", uploadResult);

        if (uploadResult.error) {
          throw new Error(uploadResult.message);
        }
        fileUrl = uploadResult.data.file_url;
      }

      const user = await User.findByIdAndUpdate(
        request.params.id,
        {
          name,
          email,
          phone,
          dateOfBirth,
          address,
          startDate,
          note,
          jobRole,
          photo: file? fileUrl : photo
        },
        { new: true }
      );

      return response.status(200).json({
        error: false,
        message: "User updated!",
        data: user,
      });
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        error: true,
        message: "Failed to update user!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      await User.findByIdAndDelete(request.params.id);

      return response.status(200).json({
        error: false,
        message: "User deleted!",
        data: {},
      });
    } catch (error) {
      return response.status(400).json({
        error: true,
        message: "Failed to delete user!",
        data: null,
      });
    }
  },
};

module.exports = UserController;
