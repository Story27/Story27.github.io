import { UserRole, Difficulty } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New password is required",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required",
      path: ["password"],
    }
  );

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 character required",
  }),
});
export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 character required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const TestCaseSchema = z.object({
  input: z.string(),
  output: z.string(),
  isSampleTestCase: z.boolean().default(false),
});

export const ProblemSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  difficulty: z.nativeEnum(Difficulty),
  topics: z.string().min(1),
  testCases: z.array(TestCaseSchema).min(1),
});

export type ProblemInput = z.infer<typeof ProblemSchema>;

export const ContestSchema = z.object({
  name: z.string().min(1, "Contest name is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  problemIds: z
    .array(z.string())
    .min(1, "At least one problem must be selected"),
});
