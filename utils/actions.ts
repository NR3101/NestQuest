"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import {
  imageSchema,
  profileSchema,
  propertySchema,
  reviewSchema,
  validateWithZodSchma,
} from "./schemas";
import prisma from "./db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { uploadImage } from "./supabase";
import { calculateTotals } from "./calculateTotals";
import { formatDate } from "./format";

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

// helper function to get the admin user
const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) {
    redirect("/");
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
      bookings: {
        select: {
          checkIn: true,
          checkOut: true,
        },
      },
    },
  });
};

// action to create a review for a property
export const createReviewAction = async (
  prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchma(reviewSchema, rawData);

    await prisma.review.create({
      data: {
        ...validatedFields,
        profileId: user.id,
      },
    });

    revalidatePath(`/properties/${validatedFields.propertyId}`);
    return { message: "Review submitted successfully" };
  } catch (error) {
    return renderError(error);
  }
};

// action to fetch the reviews of a property
export const fetchPropertyReviews = async (propertyId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      propertyId,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      profile: {
        select: {
          firstName: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

// action to fetch the reviews of a user
export const fetchPropertyReviewsByUser = async () => {
  const user = await getAuthUser();

  const reviews = await prisma.review.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      property: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

// action to delete a review of a property
export const deleteReviewAction = async (prevState: { reviewId: string }) => {
  const { reviewId } = prevState;
  const user = await getAuthUser();

  try {
    await prisma.review.delete({
      where: {
        id: reviewId,
        profileId: user.id,
      },
    });

    revalidatePath(`/reviews`);
    return { message: "Review deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
};

// action to fetch the ratings of a property
export async function fetchPropertyRatings(propertyId: string) {
  const result = await prisma.review.groupBy({
    by: ["propertyId"],
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
    where: {
      propertyId,
    },
  });

  // empty array if no reviews
  return {
    rating: result[0]?._avg.rating?.toFixed(1) ?? 0,
    count: result[0]?._count.rating ?? 0,
  };
}

// action to find the existing review of a property by a user
export const findExistingReview = async (
  userId: string,
  propertyId: string
) => {
  return prisma.review.findFirst({
    where: {
      profileId: userId,
      propertyId: propertyId,
    },
  });
};

// action to create a booking for a property
export const createBookingAction = async (prevState: {
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
}) => {
  const user = await getAuthUser();

  // delete all the bookings that are not paid before creating a new booking
  await prisma.booking.deleteMany({
    where: {
      profileId: user.id,
      paymentStatus: false,
    },
  });

  let bookingId: null | string = null;
  const { propertyId, checkIn, checkOut } = prevState;

  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
    select: {
      price: true,
    },
  });

  if (!property) {
    return { message: "Property not found" };
  }

  const { orderTotal, totalNights } = calculateTotals({
    checkIn,
    checkOut,
    price: property.price,
  });

  try {
    const booking = await prisma.booking.create({
      data: {
        propertyId,
        profileId: user.id,
        checkIn,
        checkOut,
        orderTotal,
        totalNights,
      },
    });
    bookingId = booking.id;
  } catch (error) {
    return renderError(error);
  }

  redirect(`/checkout?bookingId=${bookingId}`);
};

// action to fetch the bookings of a user
export const fetchBookings = async () => {
  const user = await getAuthUser();

  const bookings = await prisma.booking.findMany({
    where: {
      profileId: user.id,
      paymentStatus: true,
    },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          country: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};

// action to delete a booking
export const deleteBookingAction = async (prevState: { bookingId: string }) => {
  const { bookingId } = prevState;
  const user = await getAuthUser();

  try {
    await prisma.booking.delete({
      where: {
        id: bookingId,
        profileId: user.id,
      },
    });

    revalidatePath("/bookings");
    return { message: "Booking deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
};

// action to fetch the rentals of a user with bookings sums i.e total nights and order total
export const fetchRentals = async () => {
  const user = await getAuthUser();

  const rentals = await prisma.property.findMany({
    where: {
      profileId: user.id,
    },
    select: {
      id: true,
      name: true,
      price: true,
    },
  });

  const rentalsWithBookingsSums = await Promise.all(
    rentals.map(async (rental) => {
      const totalNightsSum = await prisma.booking.aggregate({
        where: {
          propertyId: rental.id,
          paymentStatus: true,
        },
        _sum: {
          totalNights: true,
        },
      });

      const orderTotalSum = await prisma.booking.aggregate({
        where: {
          propertyId: rental.id,
          paymentStatus: true,
        },
        _sum: {
          orderTotal: true,
        },
      });

      return {
        ...rental,
        totalNightsSum: totalNightsSum._sum.totalNights,
        orderTotalSum: orderTotalSum._sum.orderTotal,
      };
    })
  );

  return rentalsWithBookingsSums;
};

// action to delete a rental
export const deleteRentalAction = async (prevState: { propertyId: string }) => {
  const { propertyId } = prevState;
  const user = await getAuthUser();

  try {
    await prisma.property.delete({
      where: {
        id: propertyId,
        profileId: user.id,
      },
    });

    revalidatePath("/properties");
    return { message: "Rental deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
};

// action to fetch the details of a rental
export const fetchRentalDetails = async (propertyId: string) => {
  const user = await getAuthUser();

  return prisma.property.findUnique({
    where: {
      id: propertyId,
      profileId: user.id,
    },
  });
};

// action to update a rental
export const updatePropertyAction = async (
  prevState: { propertyId: string },
  formData: FormData
) => {
  const user = await getAuthUser();
  const propertyId = formData.get("id") as string;

  try {
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchma(propertySchema, rawData);

    await prisma.property.update({
      where: {
        id: propertyId,
        profileId: user.id,
      },
      data: {
        ...validatedFields,
      },
    });

    revalidatePath(`/rentals/${propertyId}/edit`);
    return { message: "Property updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

// action to update the image of a rental
export const updatePropertyImageAction = async (
  prevState: { propertyId: string },
  formData: FormData
) => {
  const user = await getAuthUser();
  const propertyId = formData.get("id") as string;

  try {
    const image = formData.get("image") as File;
    const validatedFields = validateWithZodSchma(imageSchema, { image });

    const publicUrl = await uploadImage(validatedFields.image);

    await prisma.property.update({
      where: {
        id: propertyId,
        profileId: user.id,
      },
      data: {
        image: publicUrl,
      },
    });

    revalidatePath(`/rentals/${propertyId}/edit`);
    return { message: "Property image updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

// action to fetch the reservations of a owner of a property
export const fetchReservations = async () => {
  const user = await getAuthUser();

  const reservations = await prisma.booking.findMany({
    where: {
      paymentStatus: true,
      property: {
        profileId: user.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          country: true,
          price: true,
        },
      },
    },
  });

  return reservations;
};

// action to fetch the stats of the app
export const fetchStats = async () => {
  await getAdminUser();

  const usersCount = await prisma.profile.count();
  const propertiesCount = await prisma.property.count();
  const bookingsCount = await prisma.booking.count({
    where: {
      paymentStatus: true,
    },
  });
  const reviewsCount = await prisma.review.count();

  return {
    usersCount,
    propertiesCount,
    bookingsCount,
    reviewsCount,
  };
};

// action to fetch the charts data
export const fetchChartsData = async () => {
  await getAdminUser();

  const date = new Date();
  date.setMonth(date.getMonth() - 6);
  const sixMonthsAgo = date;

  const bookings = await prisma.booking.findMany({
    where: {
      paymentStatus: true,
      createdAt: {
        gte: sixMonthsAgo,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const bookingsPerMonth = bookings.reduce((total, current) => {
    const date = formatDate(current.createdAt, true);
    const existingEntry = total.find((entry) => entry.date === date);

    if (existingEntry) {
      existingEntry.count++;
    } else {
      total.push({ date, count: 1 });
    }
    return total;
  }, [] as Array<{ date: string; count: number }>);

  return bookingsPerMonth;
};

// action to fetch the reservations stats of a property of a owner
export const fetchReservationsStats = async () => {
  const user = await getAuthUser();

  const properties = await prisma.property.findMany({
    where: {
      profileId: user.id,
    },
  });

  const totals = await prisma.booking.aggregate({
    _sum: {
      orderTotal: true,
      totalNights: true,
    },
    where: {
      property: {
        profileId: user.id,
      },
    },
  });

  return {
    properties: properties.length,
    nights: totals._sum.totalNights ?? 0,
    amount: totals._sum.orderTotal ?? 0,
  };
};
