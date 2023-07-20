import { RequestHandler } from "express";
import jwt from 'jsonwebtoken';
import { ErrorResponse, IToken } from "../types";

export const verifyToken: RequestHandler = (req, res, next) => {
    try {
        //1. read header from request 'Bearer xxx'
        const header = req.headers['authorization'];
        if(!header) throw new ErrorResponse(`Token is required`, 400);

        const token = header.split(' ')[1]

        //2. verify the header
        const plain_token = jwt.verify(token, process.env.JWT_PK!) as IToken;
        //2.5 add the token data in the request body, so all the future handlers can read it
        req.body['token_data'] = plain_token;

        //3. continue
        next()
    } catch(error) {
        next(error)
    }
}