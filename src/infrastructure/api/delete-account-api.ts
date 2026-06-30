import api from "./api";

export async function deleteAccount(): Promise<void> {
    await api.delete("/api/v1/user");
}