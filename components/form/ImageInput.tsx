import { Input } from "../ui/input";
import { Label } from "../ui/label";

const ImageInput = () => {
  const name = "image";

  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        Image
      </Label>
      <Input
        type="file"
        id={name}
        name={name}
        accept="image/*"
        required
        className="max-w-xs"
      />
    </div>
  );
};

export default ImageInput;
