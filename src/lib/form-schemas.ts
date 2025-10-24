import { z } from "zod";

// Innovation Form Schema
export const innovationFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(1000, "Description must be less than 1000 characters"),
  tags: z.array(z.string()),
  timeSaved: z.number().min(0, "Time saved must be positive").optional(),
  relatedFramework: z.string().optional(),
});

export type InnovationFormData = z.infer<typeof innovationFormSchema>;

// Auth Form Schema
export const authFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional(),
});

export type AuthFormData = z.infer<typeof authFormSchema>;

// Time Tracking Form Schema
export const timeTrackingFormSchema = z.object({
  selectedFramework: z.string().min(1, "Please select a framework"),
  timeSaved: z.string().min(1, "Time saved is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Time saved must be a positive number"
  ),
  activity: z.string().min(1, "Activity description is required").max(500, "Activity description must be less than 500 characters"),
  category: z.string().optional(),
});

export type TimeTrackingFormData = z.infer<typeof timeTrackingFormSchema>;
