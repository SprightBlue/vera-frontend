import {apiClient as api} from "@/presentation/api/auth.repository";

export interface ProfileResponse {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    role: 'CARER' | 'PROTECTED';
    imageUrl: string | null;
}

export interface UpdateProfileRequest {
    fullName: string;
    phone: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangeEmailRequest {
    newEmail: string;
    password: string;
}

export interface DeleteAccountRequest {
    password?: string;
}

export interface UploadImageResponse {
    email: string;
    image: string;
}

export const settingsApi = {
    getProfile: async (): Promise<ProfileResponse> => {
        const response = await api.get<ProfileResponse>('/api/v1/user/profile');
        return response.data;
    },

    updateProfile: async (payload: UpdateProfileRequest): Promise<ProfileResponse> => {
        const response = await api.put<ProfileResponse>('/api/v1/user/profile', payload);
        return response.data;
    },

    changePassword: async (payload: ChangePasswordRequest): Promise<void> => {
        await api.put('/api/v1/user/password', payload);
    },

    changeEmail: async (payload: ChangeEmailRequest): Promise<void> => {
        await api.put('/api/v1/user/email', payload);
    },

    deleteAccount: async (password: string | undefined): Promise<void> => {
        await api.delete('/api/v1/user', {
            data: {password} satisfies DeleteAccountRequest
        });
    },

    uploadUserImage: async (imageFile: File): Promise<UploadImageResponse> => {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await api.put<UploadImageResponse>('/api/v1/files/upload-user-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    uploadProtectedPersonImage: async (imageFile: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await api.patch<string>('/api/v1/files/upload-protected-person-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    deleteUserImage: async (): Promise<void> => {
        await api.delete('/api/v1/files/delete-user-image');
    }
};