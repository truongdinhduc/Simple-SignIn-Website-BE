import { response, ResponseTypes } from 'src/server/response';
import express from 'express';
import axios from 'axios'
import { find, indexOf, map, size } from 'lodash';
import jwt from 'jsonwebtoken';
import { getModel } from 'src/models/ultils';
import moment from 'moment-timezone'

const {OAuth2Client} = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET

const getUserFromToken = (token: string) => {
    try {
        let user: any = jwt.verify(token, JWT_SECRET);
        return user
    }
    catch (error) {
        return undefined
    }
}

const signUp = async (req: express.Request, res: express.Response) => {
    try {
        const { username, password } = req.body
        const userModel = getModel('user')
        const existUser = await userModel.findOne({ username: username })
        if (existUser) {
            response(res, ResponseTypes.ERROR, 'Username exists.');
            return
        }
        else {
            let user = await userModel.create({
                username: username,
                password: password,
                last_signed_in: moment()
            })
            let token = jwt.sign(user?.toJSON(), JWT_SECRET)
            response(res, ResponseTypes.OK, { token });
        }

    } catch (error) {
        response(res, ResponseTypes.ERROR, error);
    }
}

const signIn = async (req: express.Request, res: express.Response) => {
    try {
        const { username, password } = req.body
        const userModel = getModel('user')
        let user: any = await userModel.findOne({ username: username })
        if (!user) {
            response(res, ResponseTypes.ERROR, 'User does not exist.');
            return
        }
        else {
            if (password != user?.password) {
                response(res, ResponseTypes.ERROR, 'Wrong password.');
                return
            }

            let lastSignedIn = moment()
            user.last_signed_in = lastSignedIn

            await userModel.findByIdAndUpdate(user?._id, { last_signed_in: lastSignedIn })

            let token = jwt.sign(user?.toJSON(), JWT_SECRET)
            response(res, ResponseTypes.OK, { token });
        }

    } catch (error) {
        response(res, ResponseTypes.ERROR, error);
    }
}

const getMyInformation = async (req: express.Request, res: express.Response) => {
    try {
        const authorization = req.headers.authorization
        if (!authorization) {
            response(res, ResponseTypes.UNAUTHORIZED, {});
            return
        }

        let user = getUserFromToken(authorization)
        if (!user?._id) {
            response(res, ResponseTypes.UNAUTHORIZED, {});
            return
        }
        else {
            response(res, ResponseTypes.OK, user);
        }

    } catch (error) {
        response(res, ResponseTypes.ERROR, error);
    }
}

const signInWithGoogle = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id_token, client_id } = req.body
        const client = new OAuth2Client(client_id);
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: client_id,
        });

        let email = ticket?.payload?.email
        if (!email) {
            response(res, ResponseTypes.ERROR, "Please try again later.");
            return;
        }

        const userModel = getModel('user')
        let userByEmail: any = await userModel.findOne({ email: email })
        if (userByEmail?._id) {
            let lastSignedIn = moment()
            userByEmail.last_signed_in = lastSignedIn
            await userModel.findByIdAndUpdate(userByEmail?._id, { last_signed_in: lastSignedIn })

            let token = jwt.sign(userByEmail?.toJSON(), JWT_SECRET)
            response(res, ResponseTypes.OK, { token });
            return
        }
        else {
            let lastSignedIn = moment()
            userByEmail = await userModel.create({ 
                email: email,
                last_signed_in: lastSignedIn 
            })

            let token = jwt.sign(userByEmail?.toJSON(), JWT_SECRET)
            response(res, ResponseTypes.OK, { token });
            return
        }

    } catch (error) {
        response(res, ResponseTypes.ERROR, error);
    }
};


export {
    signIn,
    signInWithGoogle,
    signUp,
    getMyInformation
};