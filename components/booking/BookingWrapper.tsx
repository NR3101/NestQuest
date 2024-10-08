"use client";

import { usePropertyStore } from "@/utils/store";
import { Booking } from "@/utils/types";
import { useEffect } from "react";
import BookingContainer from "./BookingContainer";
import BookingCalendar from "./BookingCalendar";

type BookingWrapperProps = {
  propertyId: string;
  price: number;
  bookings: Booking[];
};

const BookingWrapper = ({
  propertyId,
  price,
  bookings,
}: BookingWrapperProps) => {
  useEffect(() => {
    usePropertyStore.setState({
      propertyId: propertyId,
      price: price,
      bookings: bookings,
    });
  }, [propertyId, price, bookings]);

  return (
    <>
      <BookingCalendar />
      <BookingContainer />
    </>
  );
};
export default BookingWrapper;
