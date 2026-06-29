import api from "./api";

export interface ProfileResponse {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    country: string;
    role: string;
    image: string | null;
}

export interface UpdateProfileRequest {
    fullName: string;
    phone: string;
    country: string;
}

export async function getProfile(): Promise<ProfileResponse> {
    const response = await api.get("/api/v1/user/profile");
    return response.data;
}

export async function updateProfile(
    payload: UpdateProfileRequest
): Promise<ProfileResponse> {
    const response = await api.put(
        "/api/v1/user/profile",
        payload
    );

    return response.data;
}