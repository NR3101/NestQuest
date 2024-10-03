import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type TextAreaInputProps = {
  name: string;
  labelText?: string;
  defaultValue?: string;
};

const TextAreaInput = ({
  name,
  labelText,
  defaultValue,
}: TextAreaInputProps) => {
  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        {labelText || name}
      </Label>
      <Textarea
        id={name}
        name={name}
        defaultValue={defaultValue || tempDescription}
        rows={5}
        className="leading-loose"
        required
      />
    </div>
  );
};

const tempDescription =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.";

export default TextAreaInput;
