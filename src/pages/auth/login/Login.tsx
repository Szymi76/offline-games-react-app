import { Button, Divider, Input } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useSignInWithEmailAndPassword,
  useSignInWithGithub,
  useUpdateProfile,
} from "react-firebase-hooks/auth";

import BackButton from "@/components/BackButton";
import { Github } from "lucide-react";
import PasswordInput from "@/components/PasswordInput";
import { auth } from "@/firebase";
import { useEffect } from "react";
import { useSnackbar } from "notistack";

type FormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { email, password } = data;
    await signInWithEmailAndPassword(email, password);
  };

  useEffect(() => {
    if (error) {
      let message =
        "Coś poszło nie tak podczas logowania. Spróbuj ponownie za moment";
      if (error.code === "auth/invalid-credential") {
        message = "Nie udało się zalogować. Błędny email lub hasło";
      }
      enqueueSnackbar({
        variant: "error",
        message,
      });
    }
  }, [error]);

  return (
    <div className="flex h-full items-center justify-center">
      <main className="flex w-full max-w-sm flex-col gap-7 p-5">
        <div>
          <h1 className="mb-3 text-2xl font-semibold">Zaloguj się</h1>
          <Divider />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Input
              {...register("email", { required: true })}
              label="Adres email"
              isInvalid={!!errors.email}
            />
            <PasswordInput
              {...register("password", { required: true })}
              label="Hasło"
              isInvalid={!!errors.password}
            />
          </div>
          <div>
            <Button
              isLoading={loading}
              type="submit"
              color="primary"
              fullWidth
              className="mb-1"
            >
              Przejdź dalej
            </Button>
            <span className="text-sm">
              Nie masz konta?
              <Link to="/auth/register" className="text-primary underline">
                {" "}
                Stwórz nowe
              </Link>
            </span>
          </div>
        </form>
        {/* <Providers /> */}
        <BackButton />
      </main>
    </div>
  );
};

export default Login;

const Providers = () => {
  const [signInWithGithub, user, loading, error1] = useSignInWithGithub(auth);
  const [updateProfile, updating, error2] = useUpdateProfile(auth);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLoginWithGithub = async () => {
    try {
      const signInResult = await signInWithGithub();
      const githubName =
        // @ts-ignore
        signInResult?.user.reloadUserInfo.providerUserInfo[0].screenName;
      if (!signInResult?.user.displayName) {
        await updateProfile({ displayName: githubName });
      }
      navigate(-1);
    } catch (err) {
      console.warn("Github provider error");
    }
  };

  useEffect(() => {
    if (error1 || error2) {
      const errorMsg = error1?.message || error2?.message;
      enqueueSnackbar({ variant: "error", message: errorMsg });
    }
  }, [error1, error2]);

  return (
    <div className="mt-5">
      <Button
        isLoading={loading || updating}
        startContent={<Github />}
        fullWidth
        variant="bordered"
        onPress={handleLoginWithGithub}
      >
        Zaloguj się z Github
      </Button>
    </div>
  );
};
