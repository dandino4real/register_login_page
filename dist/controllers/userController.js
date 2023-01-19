"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = exports.Register = void 0;
const UserModel_1 = require("../Models/UserModel");
const utilities_1 = require("../utils/utilities");
//register a user
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, password, confirm_password } = req.body;
        const validateInput = utilities_1.registerSchema.validate(req.body, utilities_1.options);
        console.log(validateInput);
        if (validateInput.error) {
            return res.status(400).json({
                Error: validateInput.error.details[0].message,
            });
        }
        console.log('i excape');
        //check if user exist in database
        const user = yield UserModel_1.User.findOne({ email });
        if (!user) {
            const salt = yield (0, utilities_1.GenerateSalt)();
            const userPassword = yield (0, utilities_1.GeneratePassword)(password, salt);
            const newUser = (yield UserModel_1.User.create({
                name,
                email,
                phone,
                password: userPassword,
                salt,
            }));
            return res.status(200).json({
                message: "User created successfully",
                data: newUser,
            });
        }
        else {
            return res.status(400).json({
                message: "User already exist",
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.Register = Register;
//login user
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        //validate input
        const validateInput = utilities_1.loginSchema.validate(req.body, utilities_1.options);
        if (validateInput.error) {
            return res.status(400).json({
                Error: validateInput.error.details[0].message,
            });
        }
        //check if user exist in db
        const user = yield UserModel_1.User.findOne({ email });
        if (user) {
            //compare password
            const validation = yield (0, utilities_1.validatePassword)(password, user.password, user.salt);
            if (validation) {
                const token = yield (0, utilities_1.GenerateSignature)({
                    _id: user._id,
                    email: user.email,
                });
                res.json({
                    message: "Login successful",
                    token,
                });
            }
            else {
                return res.status(400).json({
                    message: "Invalid email or password",
                });
            }
        }
        else {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.Login = Login;
