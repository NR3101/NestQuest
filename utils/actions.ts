"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import {
  imageSchema,
  profileSchema,
  propertySchema,
  validateWithZodSchma,
} from "./schemas";
import prisma from "./db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { uploadImage } from "./supabase";

// helper function to get the auth user
const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error("You must be logged in to access this page");
  }

  if (!user.privateMetadata.hasProfile) {
    redirect("/profile/create");
  }

  return user;
};

// helper function to render the error message
const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : "An error occurred",
  };
};

// action to create a profile for a user
export const createProfileAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    // get the user from clerk
    const user = await currentUser();
    if (!user) throw new Error("User not found");

    // get the data from the form and validate it using zod
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchma(profileSchema, rawData);

    // create the profile in the database
    await prisma.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl || "",
        ...validatedFields,
      },
    });

    // update the user metadata in clerk to indicate that the user has a profile
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    });
  } catch (error: any) {
    return renderError(error);
  }

  redirect("/"); // redirect to the home page after creating the profile
};

// action to fetch the profile image of the user
export const fetchProfileImage = async () => {
  const user = await currentUser();
  if (!user) return null;

  const profile = await prisma.profile.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      profileImage: true,
    },
  });

  return profile?.profileImage;
};

// action to fetch the profile of the user
export const fetchProfile = async () => {
  const user = await getAuthUser();

  const profile = await prisma.profile.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  if (!profile) {
    redirect("/profile/create");
  }

  return profile;
};

// action to update the profile of the user
export const updateProfileAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchma(profileSchema, rawData);

    await prisma.profile.update({
      where: {
        clerkId: user.id,
      },
      data: validatedFields,
    });

    revalidatePath("/profile");
    return { message: "Profile updated successfully" };
  } catch (error: any) {
    return renderError(error);
  }
};

// action to update the profile image of the user
export const updateProfileImageAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    const image = formData.get("image") as File;
    const validatedFields = validateWithZodSchma(imageSchema, { image });

    const publicUrl = await uploadImage(validatedFields.image);

    await prisma.profile.update({
      where: {
        clerkId: user.id,
      },
      data: {
        profileImage: publicUrl,
      },
    });

    revalidatePath("/profile");
    return { message: "Profile image updated successfully" };
  } catch (error: any) {
    return renderError(error);
  }
};

// action to create a property for a user
export const createPropertyAction = async (
  prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formData);
    const file = formData.get("image") as File;

    const validatedFields = validateWithZodSchma(propertySchema, rawData);
    const validatedFile = validateWithZodSchma(imageSchema, { image: file });

    const publicUrl = await uploadImage(validatedFile.image);

    await prisma.property.create({
      data: {
        ...validatedFields,
        image: publicUrl,
        profileId: user.id,
      },
    });
  } catch (error: any) {
    return renderError(error);
  }

  redirect("/");
};

// action to fetch the properties of the user by category and search
export const fetchProperties = async ({
  search = "",
  category,
}: {
  search?: string;
  category?: string;
}) => {
  const properties = await prisma.property.findMany({
    where: {
      category,
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tagline: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      tagline: true,
      country: true,
      price: true,
      image: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return properties;
};

// action to fetch the favorite property id of the user
export const fetchFavoriteId = async ({
  propertyId,
}: {
  propertyId: string;
}) => {
  const user = await getAuthUser();

  const favorite = await prisma.favorite.findFirst({
    where: {
      propertyId,
      profileId: user.id,
    },
    select: {
      id: true,
    },
  });

  return favorite?.id || null;
};

// action to toggle the favorite property of the user
export const toggleFavoriteAction = async (prevState: {
  propertyId: string;
  favoriteId: string | null;
  pathname: string;
}) => {
  const user = await getAuthUser();
  const { propertyId, favoriteId, pathname } = prevState;

  try {
    if (favoriteId) {
      await prisma.favorite.delete({
        where: {
          id: favoriteId,
        },
      });
    } else {
      await prisma.favorite.create({
        data: {
          propertyId,
          profileId: user.id,
        },
      });
    }

    revalidatePath(pathname);
    return {
      message: favoriteId ? "Removed from favorites" : "Added to favorites",
    };
  } catch (error) {
    return renderError(error);
  }
};

// action to fetch the favorites of the user
export const fetchFavorites = async () => {
  const user = await getAuthUser();

  const favorites = await prisma.favorite.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      property: {
        select: {
          id: true,
          name: true,
          tagline: true,
          country: true,
          price: true,
          image: true,
        },
      },
    },
  });

  return favorites.map((favorite) => favorite.property);
};

// action to fetch the property details
export const fetchPropertyDetails = (id: string) => {
  return prisma.property.findUnique({
    where: {
      id,
    },
    include: {
      profile: true,
    },
  });
};
