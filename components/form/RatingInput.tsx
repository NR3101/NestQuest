import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const RatingInput = ({
  name,
  labelText,
}: {
  name: string;
  labelText?: string;
}) => {
  const numbers = Array.from({ length: 5 }, (_, i) => {
    const val = i + 1;
    return val.toString();
  }).reverse();

  return (
    <div className="mb-2 max-w-xs">
      <Label htmlFor={name} className="capitalize">
        {labelText || name}
      </Label>

      <Select name={name} defaultValue={numbers[0]} required>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {numbers.map((num) => (
            <SelectItem key={num} value={num}>
              {num}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
export default RatingInput;
