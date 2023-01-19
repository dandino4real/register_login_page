import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../config';
import {UserPayload} from '../interface/user.dto'


export const registerSchema = Joi.object().keys({
    email: Joi.string().required(),
    name: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirm_password: Joi.any().equal(Joi.ref('password')).required().label('Confirm password').messages({'any.only': '{{#label}} does not match'})
    
    //Joi.ref('password')
})

export const loginSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
})


export const options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
}

//Responsible for salting the password
export const GenerateSalt = async() => {
    return await bcrypt.genSalt()
}

//Responsible for hashing the password
export const GeneratePassword = async(password:string, salt:string) => {
    return await bcrypt.hash(password, salt)
}

//Generate signature using JWT

export const GenerateSignature = async(payload: UserPayload) => {
    return jwt.sign(payload, APP_SECRET, {expiresIn: '1d'})
}
export const verifySignature = async(signature: string) => {
    return jwt.verify(signature, APP_SECRET)
}

// login



export const validatePassword = async(enteredPassword: string, savedPassword: string, salt:string) => {
    return await GeneratePassword(enteredPassword, salt) === savedPassword
}