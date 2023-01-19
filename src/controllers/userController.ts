import {Request, Response } from "express";
import { User, UserAtrributes } from "../Models/UserModel";
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  options,
  registerSchema,
  loginSchema,
  validatePassword,
} from "../utils/utilities";

//register a user
export const Register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, confirm_password } = req.body;

    const validateInput = registerSchema.validate(req.body, options);
    console.log(validateInput)
    if (validateInput.error) {
      return res.status(400).json({
        Error: validateInput.error.details[0].message,
      });
    }

    console.log('i excape')

    //check if user exist in database
    const user = await User.findOne({ email });
    if (!user) {
      const salt = await GenerateSalt();
      const userPassword = await GeneratePassword(password, salt);

      const newUser = (await User.create({
        name,
        email,
        phone,
        password: userPassword,
        salt,
      })) as unknown as UserAtrributes;

      return res.status(200).json({
        message: "User created successfully",
        data: newUser,
      });
    } else {
      return res.status(400).json({
        message: "User already exist",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//login user

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    //validate input
    const validateInput = loginSchema.validate(req.body, options);
    if (validateInput.error) {
      return res.status(400).json({
        Error: validateInput.error.details[0].message,
      });
    }

    //check if user exist in db
    const user = await User.findOne({ email });

    if (user) {
      //compare password
      const validation = await validatePassword(
        password,
        user.password,
        user.salt
      );
      if (validation) {
        const token = await GenerateSignature({
          _id: user._id,
          email: user.email,
        });
        res.json({
          message: "Login successful",
          token,
        });
      } else {
        return res.status(400).json({
          message: "Invalid email or password",
        });
      }
    } else {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
