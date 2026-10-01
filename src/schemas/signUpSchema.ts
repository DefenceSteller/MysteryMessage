import {z} from "zod";

export const usernameValidation = z
.string()
.min(2, "Username must be at least 2 characters long")
.max(100, "Username cannot exceed 100 characters long")
.regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");