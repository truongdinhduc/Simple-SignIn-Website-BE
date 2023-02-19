import express from "express";
import { ResponseType } from "./index.d";

const ResponseTypes = {
  OK: {
    code: 200,
    success: true,
    message: "OK",
  },
  ERROR: {
    code: 400,
    success: false,
    message: "There's something went wrong",
  },
  VALIDATE_FAILED: {
    code: 402,
    success: false,
    message: "Validate failed",
  },
  POST_FAILED: {
    code: 200,
    success: false,
    message: "Post failed",
  },
  MODEL_CREATE_FAILED: {
    code: 404,
    success: false,
    message: "Model can't be created",
  },
  AUTH_FAILED: {
    code: 200,
    success: false,
    message: "Auth failed",
  },
  AUTH_SUCCEEDED: {
    code: 200,
    success: true,
    message: "Auth success",
  },
  FORBIDDEN: {
    code: 403,
    success: false,
    message: "Forbidden",
  },
  UNAUTHORIZED: {
    code: 401,
    success: false,
    message: "Unauthorized",
  },
  CONFLICT: {
    code: 409,
    success: false,
    message: "Conflict",
  },
};

const log = (data: any) => {
  return data;
}

/**
 * Response lại user
 * @param res 
 * @param type 
 * @param content 
 * @param metadata 
 */
const response = (res: express.Response, type: ResponseType, content: any, metadata: any = {}) => {
  res?.status(type.code).send(log({
    success: type.success,
    message: type.message,
    meta: metadata,
    data: type.success !== true ? {} : content,
    error: type.success !== true ? (content && content.errors) || content : {},
  }));
};

export {
  response,
  ResponseTypes,
};
