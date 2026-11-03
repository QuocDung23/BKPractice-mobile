import {
  AuthFailure,
  type AvatarUploadIntent,
  type Profile,
  type ProfileRepository,
} from "@/domain/auth";

import { requestJson } from "./api-client";

export const httpProfileRepository: ProfileRepository = {
  async readMyProfile(accessToken): Promise<Profile> {
    return requestJson<Profile>({ path: "/api/profile/me", accessToken });
  },

  async updateMyProfile(accessToken, update): Promise<Profile> {
    return requestJson<Profile>({
      path: "/api/profile/me",
      method: "PATCH",
      accessToken,
      body: { ...update },
    });
  },

  async createAvatarUploadIntent(
    accessToken,
    contentType,
    size,
  ): Promise<AvatarUploadIntent> {
    try {
      return await requestJson<AvatarUploadIntent>({
        path: "/api/profile/me/avatar/upload-url",
        method: "POST",
        accessToken,
        body: { contentType, size },
      });
    } catch (error) {
      if (error instanceof AuthFailure && error.status === 400)
        throw new AuthFailure(
          "invalid_request",
          "Choose a supported image (JPEG or PNG).",
          400,
        );
      throw error;
    }
  },

  async uploadAvatar(intent, file): Promise<void> {
    let blob: Blob;
    try {
      const source = await fetch(file.uri);
      blob = await source.blob();
    } catch {
      throw new AuthFailure(
        "network",
        "Cannot read that image. Choose another one.",
      );
    }

    let response: Response;
    try {
      response = await fetch(intent.uploadUrl, {
        method: "PUT",
        headers: intent.headers,
        body: blob,
      });
    } catch {
      throw new AuthFailure(
        "network",
        "Cannot upload the image. Check your connection.",
      );
    }

    if (!response.ok)
      throw new AuthFailure(
        "unavailable",
        "The avatar upload failed. Try again.",
        response.status,
      );
  },
};
