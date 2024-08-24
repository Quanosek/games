import { object, string, TypeOf } from "zod";

export const loginUserSchema = object({
  email: string().min(1, "Nie podano adresu e-mail"),
  password: string().min(1, "Nie podano hasła"),
});

export const registerUserSchema = object({
  email: string()
    .min(1, "Adres e-mail jest wymagany")
    .email("Podany adres e-mail jest nieprawidłowy")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Podany adres e-mail jest nieprawidłowy"
    ),

  password: string()
    .min(1, "Hasło jest wymagane")
    .min(8, "Hasło musi posiadać co najmniej 8 znaków")
    .max(64, "Hasło nie może posiadać więcej niż 64 znaki")
    .regex(/[a-z]/, "Hasło musi zawierać co najmniej jedną literę")
    .regex(/[A-Z]/, "Hasło musi zawierać co najmniej jedną wielką literę")
    .regex(/[0-9]/, "Hasło musi zawierać co najmniej jedną cyfrę")
    .regex(
      /[^a-zA-Z0-9]/,
      "Hasło musi zawierać co najmniej jeden znak specjalny"
    ),
  passwordConfirm: string().min(1, "Potwierdzenie hasła jest wymagane"),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Podane hasła nie są identyczne",
});

export type LoginUserInput = TypeOf<typeof loginUserSchema>;
export type RegisterUserInput = TypeOf<typeof registerUserSchema>;
