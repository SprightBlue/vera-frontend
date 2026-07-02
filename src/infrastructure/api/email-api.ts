import api from "./api";

export interface ChangeEmailRequest {
    newEmail: string;
    password: string;
}

export async function changeEmail(
    payload: ChangeEmailRequest
): Promise<void> {

    await api.put(
        "/api/v1/user/email",
        payload
    );

}