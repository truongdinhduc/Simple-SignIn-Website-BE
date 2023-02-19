import express from 'express'
import { response, ResponseTypes } from 'src/server/response';

const getServerInformation = async (req: express.Request, res: express.Response) => {
    try {
        response(res, ResponseTypes.OK, '');
    } catch(error) {
        response(res, ResponseTypes.ERROR, error);
    }
}

export {
    getServerInformation
}