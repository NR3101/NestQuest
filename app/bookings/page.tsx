import CountryFlagAndName from "@/components/card/CountryFlagAndName";
import { IconButton } from "@/components/form/Buttons";
import FormContainer from "@/components/form/FormContainer";
import EmptyList from "@/components/home/EmptyList";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteBookingAction, fetchBookings } from "@/utils/actions";
import { formatCurrency, formatDate, formatQuantity } from "@/utils/format";
import Link from "next/link";

const BookingsPage = async () => {
  const bookings = await fetchBookings();

  if (bookings.length === 0) {
    return (
      <EmptyList
        heading="No bookings yet"
        message="You have not made any bookings yet."
      />
    );
  }

  return (
    <div className="mt-16">
      <h4 className="mb-4 capitalize font-semibold">
        Total Bookings : {bookings.length}
      </h4>
      <Table>
        <TableCaption>A list of your recent bookings</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Property Name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Nights</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const { id, checkIn, checkOut, totalNights, orderTotal } = booking;
            const { id: propertyId, name, country } = booking.property;

            return (
              <TableRow key={id}>
                <TableCell>
                  <Link
                    href={`/properties/${propertyId}`}
                    className="underline text-muted-foreground tracking-wide font-medium"
                  >
                    {name}
                  </Link>
                </TableCell>
                <TableCell>
                  <CountryFlagAndName countryCode={country} />
                </TableCell>
                <TableCell>{formatQuantity(totalNights, "night")}</TableCell>
                <TableCell>{formatCurrency(orderTotal)}</TableCell>
                <TableCell>{formatDate(checkIn)}</TableCell>
                <TableCell>{formatDate(checkOut)}</TableCell>
                <TableCell>
                  <DeleteBooking bookingId={id} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const DeleteBooking = ({ bookingId }: { bookingId: string }) => {
  const deleteBooking = deleteBookingAction.bind(null, { bookingId });

  return (
    <FormContainer action={deleteBooking}>
      <IconButton type="delete" />
    </FormContainer>
  );
};

export default BookingsPage;
