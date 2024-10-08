import * as z from "zod";
import { ZodSchema } from "zod";

// helper function to validate the data with the zod schema and throw an error if the data is invalid
export function validateWithZodSchma<T>(
  schema: ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.errors.map((error) => error.message);
    throw new Error(errors.join(", "));
  }

  return result.data;
}

// schema for the profile data
export const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  username: z
    .string()
    .min(5, { message: "Username must be at least 5 characters" }),
});

// helper function to validate the image file with the zod schema and throw an error if the image file is invalid
function validateImageFile() {
  const maxUploadSize = 1024 * 1024 * 2; // 2 MB
  const acceptedFilesTypes = ["image/"];

  return z
    .instanceof(File)
    .refine((file) => !file || file.size <= maxUploadSize, {
      message: "File size must be less than 2 MB",
    })
    .refine(
      (file) =>
        !file || acceptedFilesTypes.some((type) => file.type.startsWith(type)),
      {
        message: "Invalid image file",
      }
    );
}

// schema for the profile image data
export const imageSchema = z.object({
  image: validateImageFile(),
});

// schema for the property data
export const propertySchema = z.object({
  name: z
    .string()
    .min(5, {
      message: "name must be at least 5 characters.",
    })
    .max(100, {
      message: "name must be less than 100 characters.",
    }),
  tagline: z
    .string()
    .min(2, {
      message: "tagline must be at least 2 characters.",
    })
    .max(100, {
      message: "tagline must be less than 100 characters.",
    }),
  price: z.coerce.number().int().min(0, {
    message: "price must be a positive number.",
  }),
  category: z.string(),
  description: z.string().refine(
    (description) => {
      const wordCount = description.split(" ").length;
      return wordCount >= 10 && wordCount <= 1000;
    },
    {
      message: "description must be between 10 and 1000 words.",
    }
  ),
  country: z.string(),
  guests: z.coerce.number().int().min(0, {
    message: "guest amount must be a positive number.",
  }),
  bedrooms: z.coerce.number().int().min(0, {
    message: "bedrooms amount must be a positive number.",
  }),
  beds: z.coerce.number().int().min(0, {
    message: "beds amount must be a positive number.",
  }),
  baths: z.coerce.number().int().min(0, {
    message: "bahts amount must be a positive number.",
  }),
  amenities: z.string(),
});

// schema for the review data
export const reviewSchema = z.object({
  propertyId: z.string(),
  rating: z.coerce.number().int().min(1, {
    message: "rating must be a positive number.",
  }),
  comment: z
    .string()
    .min(10, {
      message: "comment must be at least 10 characters.",
    })
    .max(1000, {
      message: "comment must be less than 1000 characters.",
    }),
});
