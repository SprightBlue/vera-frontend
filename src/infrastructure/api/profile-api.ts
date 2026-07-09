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

export async function uploadUserImage(image: File, email: string): Promise<string> {
    const formData = new FormData();

    formData.append("image", image);
    formData.append("email", email);

    const response = await api.put(
        "/api/v1/files/upload-user-image",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data.image;
}

export async function deleteUserImage(id: number): Promise<void> {
    await api.delete(`/api/v1/files/delete-user-image/${id}`);
}