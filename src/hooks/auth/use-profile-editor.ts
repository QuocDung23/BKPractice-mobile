import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

import {
  AuthFailure,
  requestAvatarUpload,
  saveMyProfile,
  uploadAvatar,
  type Profile,
  type ProfileUpdate,
} from "@/domain/auth";
import { profileRepository } from "@/lib/auth";
import { writeCachedProfile } from "@/lib/profile";
import { useAuthSession } from "@/stores/auth-session";

const MAX_AVATAR_BYTES = 52_428_800;
const MAX_DISPLAY_NAME_LENGTH = 100;
const MAX_BIO_LENGTH = 1000;

type PickedAvatar = {
  uri: string;
  contentType: string;
  size: number;
};

export type ProfileEditorState = {
  displayName: string;
  bio: string;
  avatarUri: string | null;
  isUploadingAvatar: boolean;
  isSaving: boolean;
  error: string | null;
  notice: string | null;
  setDisplayName: (value: string) => void;
  setBio: (value: string) => void;
  pickAvatar: () => Promise<void>;
  removeAvatar: () => void;
  save: () => Promise<boolean>;
};

async function readImageSize(uri: string): Promise<number> {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob.size;
}

async function pickAvatarImage(): Promise<PickedAvatar | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted)
    throw new AuthFailure(
      "forbidden",
      "Allow photo access in Settings to choose an avatar.",
    );

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });
  if (result.canceled) return null;

  const asset = result.assets[0];
  const measuredSize = asset.fileSize ?? 0;
  const size =
    measuredSize > 0 ? measuredSize : await readImageSize(asset.uri);
  return {
    uri: asset.uri,
    contentType: asset.mimeType ?? "image/jpeg",
    size,
  };
}

export function useProfileEditor(profile: Profile): ProfileEditorState {
  const { session, clearSession } = useAuthSession();
  const [displayName, setDisplayNameState] = useState(profile.displayName);
  const [bio, setBioState] = useState(profile.bio ?? "");
  const [avatarUri, setAvatarUri] = useState<string | null>(profile.avatar);
  const [avatarValue, setAvatarValue] = useState<string | null | undefined>();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function setDisplayName(value: string): void {
    setDisplayNameState(value);
    setError(null);
    setNotice(null);
  }

  function setBio(value: string): void {
    setBioState(value);
    setError(null);
    setNotice(null);
  }

  async function pickAvatar(): Promise<void> {
    if (!session || isUploadingAvatar) return;
    setError(null);
    setNotice(null);
    setIsUploadingAvatar(true);
    try {
      const picked = await pickAvatarImage();
      if (!picked) return;
      if (picked.size < 1) {
        setError("Choose a valid image.");
        return;
      }
      if (picked.size > MAX_AVATAR_BYTES) {
        setError("Choose an image smaller than 50 MB.");
        return;
      }
      const intent = await requestAvatarUpload(
        profileRepository,
        session,
        picked.contentType,
        Math.round(picked.size),
      );
      await uploadAvatar(profileRepository, intent, {
        uri: picked.uri,
        contentType: picked.contentType,
      });
      setAvatarUri(picked.uri);
      setAvatarValue(intent.avatar);
      setNotice("Photo ready. Save to apply it.");
    } catch (cause) {
      if (cause instanceof AuthFailure && cause.status === 401) {
        clearSession(undefined, session);
        return;
      }
      setError(
        cause instanceof AuthFailure
          ? cause.message
          : "Could not upload that photo. Try again.",
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  function removeAvatar(): void {
    setAvatarUri(null);
    setAvatarValue(null);
    setError(null);
    setNotice("Photo will be removed when you save.");
  }

  async function save(): Promise<boolean> {
    if (!session || isSaving) return false;
    const nextDisplayName = displayName.trim();
    const nextBio = bio.trim();
    setError(null);
    setNotice(null);

    if (!nextDisplayName) {
      setError("Enter a display name.");
      return false;
    }
    if (nextDisplayName.length > MAX_DISPLAY_NAME_LENGTH) {
      setError(`Display name must be ${MAX_DISPLAY_NAME_LENGTH} characters or fewer.`);
      return false;
    }
    if (nextBio.length > MAX_BIO_LENGTH) {
      setError(`Bio must be ${MAX_BIO_LENGTH} characters or fewer.`);
      return false;
    }

    const update: ProfileUpdate = {
      displayName: nextDisplayName,
      bio: nextBio || null,
    };
    if (avatarValue !== undefined) update.avatar = avatarValue;

    setIsSaving(true);
    try {
      const savedProfile = await saveMyProfile(profileRepository, session, update);
      writeCachedProfile(savedProfile);
      return true;
    } catch (cause) {
      if (cause instanceof AuthFailure && cause.status === 401) {
        clearSession(undefined, session);
        return false;
      }
      setError(
        cause instanceof AuthFailure
          ? cause.message
          : "Could not save your profile. Try again.",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  return {
    displayName,
    bio,
    avatarUri,
    isUploadingAvatar,
    isSaving,
    error,
    notice,
    setDisplayName,
    setBio,
    pickAvatar,
    removeAvatar,
    save,
  };
}
