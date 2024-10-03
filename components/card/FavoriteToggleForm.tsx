"use client";

import { usePathname } from "next/navigation";
import FormContainer from "../form/FormContainer";
import { CardSubmitButton } from "../form/Buttons";
import { toggleFavoriteAction } from "@/utils/actions";

type FavoriteToggleFormProps = {
  favoriteId: string | null;
  propertyId: string;
};

const FavoriteToggleForm = ({
  favoriteId,
  propertyId,
}: FavoriteToggleFormProps) => {
  const pathname = usePathname();
  const toggleAction = toggleFavoriteAction.bind(null, {
    propertyId,
    favoriteId,
    pathname,
  });

  return (
    <FormContainer action={toggleAction}>
      <CardSubmitButton isFavorite={favoriteId ? true : false} />
    </FormContainer>
  );
};

export default FavoriteToggleForm;
