const { AccountStatus } = require('../../config/constants');
const { validationResult } = require("express-validator");

const User = require('../../features/users/models/UserModel');
const Authentication = require('../services/AuthService');
const bcrypt = require('bcrypt');
const Role = require('../../features/users/models/RoleModel');

const AuthController = {
    async login(request, response, next) {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.status(422).json({
                error: true,
                message: 'Validation errors',
                data: errors,
            });
        }

        const { email, password } = request.body;

        try {
            const user = await User.findOne({ "email": email });

            if (!user) {
                return response.status(401).json({
                    error: true,
                    message: 'Invalid email or password.',
                    data: null,
                });
            }

            if (!user.comparePassword(password)) {
                return response.status(401).json({
                    error: true,
                    message: 'Invalid email or password.',
                    data: null,
                });
            }

            Authentication.signToken(user, response, next);

        } catch (error) {
            return response.status(400).json({
                error: true,
                message: 'Login Failed!',
                data: null,
            });
        }
    },

    async register(request, response, next) {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.status(422).json({
                error: true,
                message: 'Validation errors',
                data: errors,
            });
        }

        const { name, email, password, phone, dob, address, start_date, note, role_id, job_role, document } = request.body;
            
        try {
            const user = await User.findOne({ "email": email });

            if (user) {
                return response.status(400).json({
                    error: true,
                    message: 'Email already using.',
                    data: null,
                });
            }

            const role = await Role.findById(role_id);

            const newUser = await User({
                name,
                email,
                phone,
                dateOfBirth: dob,
                address,
                startDate: start_date,
                note,
                role,
                jobRole: job_role,
                password: bcrypt.hashSync(password, 10),
                accountStatus: AccountStatus.ACTIVE,
                documents: {
                    fileUrl: document,
                }
            }).save();

            Authentication.signToken(newUser, response, next);
        } catch (error) {
            console.log(error);
            return response.status(400).json({
                error: true,
                message: 'Registration Failed!',
                data: null,
            });
        }
    },

    async me(request, response, next) {
        const user = await User.findById(request.user._id)
        // .populate({
        //     path: 'role', 
        //     populate: ['rolePermissions'],
        // })
        .select(['-password']);

        return response.status(200).json({
            error: false,
            message: 'Account retrived!',
            data: {
                user,
            },
        });
    }
}

module.exports = AuthController;
