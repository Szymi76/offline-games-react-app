import { Button, Divider, Input } from "@nextui-org/react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
} from "react-firebase-hooks/auth";

import BackButton from "@/components/BackButton";
import { Link } from "react-router-dom";
import PasswordInput from "@/components/PasswordInput";
import { auth } from "@/firebase";
import { useEffect } from "react";
import { useSnackbar } from "notistack";

type FormValues = {
  displayName: string;
  email: string;
  password: string;
  passwordRepeat: string;
};

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [createUserWithEmailAndPassword, user, loading1, error1] =
    useCreateUserWithEmailAndPassword(auth);
  const [updateProfile, loading2, error2] = useUpdateProfile(auth);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { displayName, email, password } = data;
    await createUserWithEmailAndPassword(email, password);
    await updateProfile({ displayName });
  };

  useEffect(() => {
    if (error1 || error2)
      enqueueSnackbar({
        variant: "error",
        message:
          "Coś poszło nie tak podczas tworzenia konta. Spróbuj ponownie za chwilę",
      });
  }, [error1, error2]);

  return (
    <div className="flex h-full items-center justify-center">
      <main className="flex w-full max-w-sm flex-col gap-7 p-5">
        <div>
          <h1 className="mb-3 text-2xl font-semibold">Stwórz konto</h1>
          <Divider />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Input
              {...register("displayName", {
                required: true,
                minLength: { value: 3, message: "Twoja nazwa jest za krótka" },
                maxLength: { value: 14, message: "Twoja nazwa jest za długa" },
              })}
              label="Twoja nazwa"
              isInvalid={!!errors.displayName}
              errorMessage={errors.displayName?.message}
            />
            <Input
              {...register("email", { required: true })}
              label="Adres email"
              isInvalid={!!errors.email}
            />
            <PasswordInput
              {...register("password", {
                required: true,
                minLength: { value: 6, message: "Hasło jest za krótkie" },
              })}
              label="Hasło"
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
            />
            <PasswordInput
              {...register("passwordRepeat", {
                required: true,
                validate: (val) => {
                  if (watch("password") !== val)
                    return "Hasła nie są takie same";
                },
              })}
              label="Powtórz hasło"
              isInvalid={!!errors.passwordRepeat}
              errorMessage={errors.passwordRepeat?.message}
            />
          </div>
          <div>
            <Button
              isLoading={loading1 || loading2}
              type="submit"
              color="primary"
              fullWidth
              className="mb-1"
            >
              Przejdź dalej
            </Button>
            <span className="text-sm">
              Masz konto?
              <Link to="/auth/login" className="text-primary underline">
                {" "}
                Zaloguj się
              </Link>
            </span>
          </div>
        </form>
        <BackButton />
      </main>
    </div>
  );
};

export default Register;
