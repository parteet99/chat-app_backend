export interface RegisterInput {
    email: string;
    password: string;
    displayName: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface AuthUser {
    id: string;
    email: string;
    display_name: string;
    avatar_key: string | null;
}

export interface JwtPayload {
    sub: string;
}
