import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from './auth.model';
import { ErrorResponse, IResponse } from '../types';
import { Types } from 'mongoose';


export const sign_up: RequestHandler<unknown, IResponse<string>, IUser> = async (req, res, next) => {
    try {
        if(!req.body.password) throw new ErrorResponse(`Password is required`, 400);
         const hashedPassword = await bcrypt.hash(req.body.password, 10);

         const results = await User.create({
            _id: new Types.ObjectId(),
            ...req.body,
            password: hashedPassword
         })
         res.json({ success: true, data:results._id.toString() })
    } catch (error) {
        next(error)
    }
}

export const sign_in: RequestHandler<unknown, IResponse<string>, {email: string, password: string}> = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        //1. find the user
        const user = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });
        if(!user) throw new ErrorResponse(`User is not found`, 404);

        //2. check the password
        const match = await bcrypt.compare(password, user.password!);
        if(!match) throw new ErrorResponse(`Passwords do not match`, 404);

        //3. create JWT
        if(!process.env.JWT_PK) throw new ErrorResponse(`Private key is not found`, 404);
        const jwt_token = jwt.sign({
            _id: user._id,
            fullname: user.name,
            email: user.email
        }, process.env.JWT_PK);

        //4. send response
        res.json({ success: true, data: jwt_token })
    } catch (error) {
        next(error)
    }
}

export const change_password: RequestHandler<unknown, IResponse<number>, {email: string, old_password: string, new_password: string}> =async (req, res, next) => {
    try {
        const { email, old_password, new_password } = req.body;
        //1. find user
        const user = await User.findOne({ email });
        if(!user) throw new ErrorResponse(`User is not found`, 404);

        //2. compare old_password with new_password
        const match = await bcrypt.compare(old_password, user.password!);
        if(!match) throw new ErrorResponse(`Original password is not correct`, 404);

        //3. hash the new password
        const hashed_new_password = await bcrypt.hash(new_password, 10);

        //4. update the password in DB with new hashed password
        const results = await User.updateOne(
            { email },
            { $set: { password: hashed_new_password } }
        )
        //5. confirm the change in the response
        res.json({ success: true, data: results.modifiedCount })
    } catch (error) {
        next(error)
    }
}