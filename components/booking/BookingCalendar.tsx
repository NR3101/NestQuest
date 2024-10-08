"use client";

import {
  defaultSelected,
  generateBlockedPeriods,
  generateDateRange,
  generateDisabledDates,
} from "@/utils/calendar";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Calendar } from "../ui/calendar";
import { usePropertyStore } from "@/utils/store";
import { useToast } from "@/hooks/use-toast";

const BookingCalendar = () => {
  const currentDate = new Date();
  const [range, setRange] = useState<DateRange | undefined>(defaultSelected);
  const bookings = usePropertyStore((state) => state.bookings);
  const { toast } = useToast();

  const blockedPeriods = generateBlockedPeriods({
    bookings,
    today: currentDate,
  });

  const unavailableDates = generateDisabledDates(blockedPeriods);

  // Updating the store with the selected range whenever the range changes
  useEffect(() => {
    const selectedRange = generateDateRange(range);
    const isDisabledDateIncluded = selectedRange.some((date) => {
      if (unavailableDates[date]) {
        setRange(defaultSelected);
        toast({
          description: "These dates are unavailable.Select another date",
        });
        return true;
      }
      return false;
    });

    usePropertyStore.setState({
      range: range,
    });
  }, [range, unavailableDates, toast]);

  return (
    <Calendar
      mode="range"
      defaultMonth={currentDate}
      selected={range}
      onSelect={setRange}
      className="mb-4"
      disabled={blockedPeriods}
    />
  );
};
export default BookingCalendar;
