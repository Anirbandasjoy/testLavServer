import { Request, Response, NextFunction } from "express";
import cors from "cors";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import sendingEmail from "../service/user/email";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
export {
  Request,
  Response,
  NextFunction,
  cors,
  createError,
  jwt,
  nodemailer,
  sendingEmail,
  bcrypt,
  cookieParser,
  mongoose,
};
