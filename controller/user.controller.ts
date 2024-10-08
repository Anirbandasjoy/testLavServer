import { NextFunction, Request, Response } from "express";
import { bcrypt, createError, jwt, sendingEmail } from "../helper/import";
import { userExistByEmail } from "../helper/exist";
import User, { UserDocument } from "../models/user.model";
import { createToken } from "../helper/jsonWebToken";
import {
  processRegistationExpiresIn,
  processRegistationSecretKey,
} from "../helper/secret";
import { successResponse } from "../helper/reponse";
import { findWithId } from "../service";
import { generateActivationEmailTemplate } from "../helper/emailTemplate";

export const handleProcessRegistation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, profileImage, phone, address } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    await userExistByEmail(email, User);
    const token = createToken(
      {
        name,
        email,
        password: hashPassword,
        profileImage,
        phone,
        address,
      },
      processRegistationSecretKey,
      processRegistationExpiresIn
    );
    if (!token) {
      throw createError(401, "Not Genaret Token");
    }
    const emailData = {
      email,
      subject: "User Activation Email",
      html: generateActivationEmailTemplate(name, token),
    };
    try {
      await sendingEmail(emailData);
    } catch (error) {
      console.error(error);
    }
    successResponse(res, {
      message: `Please Active you email : ${email}`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

export const handleRegisterdUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;
    if (!token) {
      throw createError(404, "Token Not found");
    }
    const decoded = jwt.verify(
      token,
      processRegistationSecretKey
    ) as jwt.JwtPayload;
    if (!decoded) {
      throw createError(203, "Invalid Token");
    }

    await userExistByEmail(decoded.email, User);

    await User.create(decoded);
    successResponse(res, {
      message: "Registation Process Complete",
    });
  } catch (error) {
    next(error);
  }
};

export const handleUpdatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword, confrimPassword } = req.body;
    const user = await findWithId(id, User);
    const matchPassword = await bcrypt.compare(oldPassword, user.password);
    if (!matchPassword) {
      throw createError(400, "Old password in incorrect");
    }
    if (newPassword !== confrimPassword) {
      throw createError(400, "newPassword and confrimpassword don't match");
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();
    successResponse(res, {
      message: "Successfully updated password",
    });
  } catch (error) {
    next(error);
  }
};
// get current user
export const handleGetCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    successResponse(res, {
      message: "Fetched currentUser Successfully",
      payload: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export const handleFindAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = "1", limit = "20" } = req.query;
    const pageNumber = Math.max(parseInt(page as string, 10) || 1, 1);
    const limitNumber = Math.max(parseInt(limit as string, 10) || 20, 1);

    const users = await User.find()
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    if (!users || users.length === 0) {
      return next(createError(404, "No users found"));
    }

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limitNumber);

    successResponse(res, {
      message: "All users returned",
      payload: {
        users,
        pagination: {
          totalUsers,
          totalPages,
          currentPage: pageNumber,
          pageSize: limitNumber,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleFindSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await findWithId(id, User);
    successResponse(res, {
      message: "Single User fetched successfully",
      payload: user,
    });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await findWithId(id, User);
    if (role !== undefined) user.role = role;
    await user.save();
    successResponse(res, {
      message: "Role was updated successfully",
      payload: user,
    });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateUserInformation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await findWithId(id, User);
    const { name, profileImage, backgroundImage, phone, address } = req.body;
    if (name !== undefined) user.name = name;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (backgroundImage !== undefined) user.backgroundImage = backgroundImage;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    await user.save();
    successResponse(res, {
      message: "User info updated successfully",
      payload: user,
    });
  } catch (error) {
    next(error);
  }
};

export const handleUserDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return next(createError(400, "User not deleted , somthing was rong"));
    }

    successResponse(res, {
      message: "User was deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
