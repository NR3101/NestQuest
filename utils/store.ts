import { create } from "zustand";
import { Booking } from "./types";
import { DateRange } from "react-day-picker";

// shape of the store
type PropertyState = {
  propertyId: string;
  price: number;
  bookings: Booking[];
  range: DateRange | undefined;
};

// Property Store
export const usePropertyStore = create<PropertyState>((set) => {
  return {
    propertyId: "",
    price: 0,
    bookings: [],
    range: undefined,
  };
});
