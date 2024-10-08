import { calculateTotals } from "@/utils/calculateTotals";
import { formatCurrency, formatQuantity } from "@/utils/format";
import { usePropertyStore } from "@/utils/store";
import { Card, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

const BookingForm = () => {
  const { range, price } = usePropertyStore((state) => state);
  const checkIn = range?.from as Date;
  const checkOut = range?.to as Date;

  const { totalNights, subTotal, cleaningFee, serviceFee, GST, orderTotal } =
    calculateTotals({ checkIn, checkOut, price });

  return (
    <Card className="p-8 mb-4">
      <CardTitle className="mb-8 text-primary font-bold">Summary</CardTitle>
      <FormRow
        label={`$${price}/night * ${formatQuantity(totalNights, "night")}`}
        amount={subTotal}
      />
      <FormRow label="Cleaning Fee" amount={cleaningFee} />
      <FormRow label="Service Fee" amount={serviceFee} />
      <FormRow label="GST" amount={GST} />

      <Separator className="mt-4" />
      <CardTitle className="mt-8">
        <FormRow label="Booking Total" amount={orderTotal} />
      </CardTitle>
    </Card>
  );
};

const FormRow = ({ label, amount }: { label: string; amount: number }) => {
  return (
    <p className="flex justify-between text-sm mb-2">
      <span>{label}</span>
      <span className="font-bold">{formatCurrency(amount)}</span>
    </p>
  );
};

export default BookingForm;
