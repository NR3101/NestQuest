import { fetchPropertyRatings } from "@/utils/actions";
import { FaStar } from "react-icons/fa";

const PropertyRating = async ({
  propertyId,
  inPage,
}: {
  propertyId: string;
  inPage: boolean;
}) => {
  const { rating, count } = await fetchPropertyRatings(propertyId);
  if (count === 0) return null;

  const className = `flex items-center gap-1 ${inPage ? "text-md" : "text-xs"}`;
  const countText = count > 1 ? "reviews" : "review";
  const countValue = `(${count}) ${inPage ? countText : ""}`;

  return (
    <span className={className}>
      <FaStar className="size-3" />
      {rating} {countValue}
    </span>
  );
};

export default PropertyRating;
