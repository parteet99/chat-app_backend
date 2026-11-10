import { findUserById, updateUserProfile, searchUsers } from "./user.queries";
import { ApiError } from "../../utils/ApiError";
import type { UpdateProfileInput } from "./user.types";

//get profile
export const getUserProfile = async (userId: string) => {
    const user = await findUserById(userId);
    if (!user) {
        throw new ApiError(
            404,
            "USER_NOT_FOUND",
            "User not found"
        )
    }

    return user;
};

//update profile
export const editUserProfile = async(
    userId: string,
    data: UpdateProfileInput
) => {
    const user = await updateUserProfile(
        userId,
        data.displayName!
    );

    if (!user) {
        throw new ApiError(
            404,
            "USER_NOT_FOUND",
            "User not found"
        )
    }

    return user;
}

// search user
export const findUsers = async(
    query: string,
    // currentUserId: string
) => {
    return searchUsers(query);
}