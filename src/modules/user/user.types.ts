export interface UserProfile{
    id: string,
    email: string,
    display_name: string,
    avatar_key: string | null,
    created_at: Date
}

export interface UpdateProfileInput{
    displayName?: string;
}

export interface SearchUsersInput{
    query: string;
}