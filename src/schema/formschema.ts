import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().min(2).max(50),
  password: z.string().min(8).max(20),
});

export const registerFormSchema = z.object({
  email: z.string().min(2).max(50),
  password: z.string().min(8).max(20),
  username: z.string().min(6).max(20),
})

export type LoginFormSchemaType = z.infer<typeof loginFormSchema>;
export type RegisterFormSchemaType = z.infer<typeof registerFormSchema>;