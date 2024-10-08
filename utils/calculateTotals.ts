import { calculateDaysBetween } from "./calendar";

type BookingDetails = {
  checkIn: Date;
  checkOut: Date;
  price: number;
};

export const calculateTotals = ({
  checkIn,
  checkOut,
  price,
}: BookingDetails) => {
  const totalNights = calculateDaysBetween({ checkIn, checkOut });
  const subTotal = totalNights * price;
  const cleaningFee = 20;
  const serviceFee = 40;
  const GST = subTotal * 0.1;
  const orderTotal = subTotal + cleaningFee + serviceFee + GST;

  return {
    totalNights,
    subTotal,
    cleaningFee,
    serviceFee,
    GST,
    orderTotal,
  };
};
