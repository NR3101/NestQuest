"use client";

import { actionFunction } from "@/utils/types";
import Image from "next/image";
import { useState } from "react";
import { LuUser2 } from "react-icons/lu";
import { Button } from "../ui/button";
import FormContainer from "./FormContainer";
import ImageInput from "./ImageInput";
import { SubmitButton } from "./Buttons";

type ImageInputContainerProps = {
  name: string;
  image: string;
  action: actionFunction;
  text: string;
  children?: React.ReactNode;
};

const ImageInputContainer = ({
  name,
  image,
  action,
  text,
  children,
}: ImageInputContainerProps) => {
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
  const userIcon = (
    <LuUser2 className="size-24 bg-primary rounded text-white mb-4" />
  );

  return (
    <div>
      {image ? (
        <Image
          src={image}
          alt={name}
          width={100}
          height={100}
          className="rounded object-cover mb-4 size-24"
        />
      ) : (
        userIcon
      )}
      <Button
        onClick={() => setIsUpdateFormVisible((prev) => !prev)}
        className="capitalize"
        size="sm"
        variant="outline"
      >
        {text}
      </Button>

      {isUpdateFormVisible && (
        <div className="max-w-lg mt-4">
          <FormContainer action={action}>
            {children}

            <ImageInput />
            <SubmitButton size="sm" />
          </FormContainer>
        </div>
      )}
    </div>
  );
};

export default ImageInputContainer;
