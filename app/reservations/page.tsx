import CountryFlagAndName from "@/components/card/CountryFlagAndName";
import EmptyList from "@/components/home/EmptyList";
import Stats from "@/components/reservations/Stats";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchReservations } from "@/utils/actions";
import { formatCurrency, formatDate, formatQuantity } from "@/utils/format";
import Link from "next/link";

const ReservationsPage = async () => {
  const reservations = await fetchReservations();
  if (reservations.length === 0) {
    return (
      <EmptyList
        heading="No reservations found"
        message="You have no reservations yet"
      />
    );
  }

  return (
    <>
      <Stats />

      <div className="mt-16">
        <h4 className="mb-4 capitalize font-semibold">
          Total Reservations : {reservations.length}
        </h4>

        <Table>
          <TableCaption>
            A list of all reservations for your properties.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Property Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Nights</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => {
              const { id, orderTotal, totalNights, checkIn, checkOut } =
                reservation;
              const { id: propertyId, name, country } = reservation.property;
              return (
                <TableRow key={id}>
                  <TableCell>
                    <Link
                      href={`/properties/${propertyId}`}
                      className="underline tracking-wide text-muted-foreground font-medium"
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
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
export default ReservationsPage;
