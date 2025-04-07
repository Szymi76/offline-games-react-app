import { Button, Divider, Input, Spacer } from "@nextui-org/react";
import React, { useState } from "react";
import { auth, storage } from "@/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { useAuthState, useUpdateProfile } from "react-firebase-hooks/auth";
import { useDownloadURL, useUploadFile } from "react-firebase-hooks/storage";

import PhotoInput from "./components/PhotoInput";
import { useSnackbar } from "notistack";

type DisplayNameType = {
  value?: string;
  error?: string;
};

type PhotoType = {
  value: File | null;
  default?: string;
};

const Settings = () => {
  const [user] = useAuthState(auth);
  const [uploadFile, uploading, snapshot, error2] = useUploadFile();
  const { enqueueSnackbar } = useSnackbar();
  const [updateProfile, updating, error3] = useUpdateProfile(auth);
  const [displayName, setDisplayName] = useState<DisplayNameType>({
    value: user?.displayName ?? undefined,
    error: undefined,
  });
  const [photo, setPhoto] = useState<PhotoType>({
    value: null,
    default: user?.photoURL ?? undefined,
  });

  const isDisplayNameHasChanged = displayName.value !== user?.displayName;
  const isPhotoHasChanged =
    !!photo.value || (!photo.default && !!user?.photoURL);
  const isSomethingHasChanged = isDisplayNameHasChanged || isPhotoHasChanged;

  const handleResetInputs = () => {
    setDisplayName({ value: user?.displayName ?? undefined, error: undefined });
    setPhoto({ value: null, default: user?.photoURL ?? undefined });
  };

  const handleFileChange = (newFile: File | null) => {
    setPhoto({ ...photo, value: newFile });
  };

  const handleFileClear = () => {
    setPhoto({ value: null, default: undefined });
  };

  const handleSave = async () => {
    // validating
    if (!displayName.value) {
      return setDisplayName({ ...displayName, error: "Pole jest wymagane" });
    }

    if (displayName.value.trim().length < 3) {
      return setDisplayName({
        ...displayName,
        error: "Twoja nazwa jest za krótka (min. 3 znaki)",
      });
    }

    // uploading
    let newPhotoUrl = "";
    const photoStorageUrl = `user-avatar-${user!.uid}`;
    const photoRef = ref(storage, photoStorageUrl);
    if (photo.value) {
      const uploadResult = await uploadFile(photoRef, photo.value);
      if (uploadResult) {
        const url = await getDownloadURL(uploadResult.ref);
        newPhotoUrl = url;
      }
    }

    updateProfile({
      displayName: displayName.value,
      photoURL: isPhotoHasChanged ? newPhotoUrl : user?.photoURL,
    })
      .then(() => {
        enqueueSnackbar({
          variant: "success",
          message: "Zaktualizowano profil",
        });
      })
      .catch(() => {
        enqueueSnackbar({
          variant: "error",
          message: "Coś poszło nie tak podczas zapisywania",
        });
      });
  };

  return (
    <main className="mx-auto max-w-md px-5 py-10">
      <h1 className="text-2xl font-bold">Ustawienia</h1>
      {/* <Divider className="mt-1" /> */}
      <Spacer y={4} />
      <SettingContainer label="Twoja wyświetlana nazwa">
        <Input
          className="max-w-sm"
          value={displayName.value}
          onChange={(e) =>
            setDisplayName({ value: e.target.value, error: undefined })
          }
          label="Twoja nazwa"
          isInvalid={!!displayName.error}
          errorMessage={displayName.error}
        />
      </SettingContainer>
      <SettingContainer label="Twój awatar">
        <PhotoInput
          file={photo.value}
          defaultUrl={photo.default}
          onFileChange={handleFileChange}
          onClear={handleFileClear}
        />
      </SettingContainer>
      <div className="flex justify-end gap-2 py-2">
        {isSomethingHasChanged && (
          <Button color="danger" onPress={handleResetInputs}>
            Anuluj
          </Button>
        )}
        <Button
          isLoading={updating || uploading}
          isDisabled={!isSomethingHasChanged}
          color="primary"
          onPress={handleSave}
        >
          Zapisz
        </Button>
      </div>
    </main>
  );
};

export default Settings;

type SettingContainerProps = { children: React.ReactNode; label: string };
const SettingContainer = (props: SettingContainerProps) => {
  return (
    <div className="py-3">
      <h2 className="text-lg font-semibold text-default-600">{props.label}</h2>
      <Divider className="mb-2 mt-1" />
      {props.children}
    </div>
  );
};
