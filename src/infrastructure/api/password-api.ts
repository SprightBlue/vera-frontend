import api from "./api";

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export async function changePassword(
    payload: ChangePasswordRequest
): Promise<void> {

    await api.put(
        "/api/v1/user/password",
        payload
    );

}