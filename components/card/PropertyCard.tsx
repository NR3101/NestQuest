import { formatCurrency } from "@/utils/format";
import { PropertyCardProps } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import PropertyRating from "./PropertyRating";
import FavoriteToggleButton from "./FavoriteToggleButton";
import CountryFlagAndName from "./CountryFlagAndName";

const PropertyCard = ({ property }: { property: PropertyCardProps }) => {
  const { name, image, price } = property;
  const { country, id: propertyId, tagline } = property;

  return (
    <article className="group relative">
      <Link href={`/properties/${propertyId}`}>
        <div className="relative h-[300px] mb-2 overflow-hidden rounded-md">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width:768px) 100vw,50vw"
            className="rounded-md object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-sm mt-1">
            {name.substring(0, 30)}
          </h3>
          {/* Property Rating */}
          <PropertyRating propertyId={propertyId} inPage={false} />
        </div>

        <p className="text-sm mt-1 text-muted-foreground">
          {tagline.substring(0, 40)}
        </p>

        <div className="flex justify-between items-center mt-1">
          <p className="text-sm mt-1">
            <span className="font-bold">{formatCurrency(price)}</span> /
            night
          </p>
          {/* Country Flag and Name */}
          <CountryFlagAndName countryCode={country} />
        </div>
      </Link>

      <div className="absolute top-5 right-5 z-5">
        {/* Favorite Toggle Button */}
        <FavoriteToggleButton propertyId={propertyId} />
      </div>
    </article>
  );
};

export default PropertyCard;
