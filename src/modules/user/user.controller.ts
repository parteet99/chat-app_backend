//controller will
/*
-Read the authenticated user's id.
-Validate request data.
-call the service
-return the appropriate http response.
*/
import type {
    Response,
    NextFunction
} from "express";

import type {
    AuthRequest
} from "../../middleware/auth.middleware";

import { getUserProfile, editUserProfile, findUsers } from "./user.service";
import { updateProfileSchema, SearchUsersSchema } from "./user.validation";
import { ApiError } from "../../utils/ApiError";

// get /api/users/me
export const getProfile = async(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await getUserProfile(req.user!.id);
        return res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        next(error);
    }
}

//patch /api/users/me
export const updateProfile = async(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const validation = updateProfileSchema.safeParse(req.body);
        if (!validation.success) {
            throw new ApiError(
                400,
                "VALIDATION_ERROR",
                validation.error.issues[0].message
            )
        }

        const user = await editUserProfile(
            req.user!.id,
            {
                displayName: validation.data.displayName
            }
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user
        })
    } catch (error) {
        next(error);
    }
}

// get /api/users/search?query=rahul
export const searchUserController = async(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const validation = SearchUsersSchema.safeParse({
            query: req.query.query
        });

        if (!validation.success) {
            throw new ApiError(
                400,
                "VALIDATION_ERROR",
                validation.error.issues[0].message
            )
        }

        const users = await findUsers(
            validation.data.query,
            // req.user!.id
        );

        res.status(200).json({
            success: true,
            data: users
        })
    } catch (error) {
        next(error);
    }
}