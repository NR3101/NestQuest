"use client";

import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useFormStatus } from "react-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { LuPenSquare, LuTrash2 } from "react-icons/lu";

type btnSize = "default" | "lg" | "sm";

type SubmitButtonProps = {
  className?: string;
  text?: string;
  size?: btnSize;
};

// Submit Button for forms
export const SubmitButton = ({
  className = "",
  text = "submit",
  size = "lg",
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={`capitalize ${className}`}
      size={size}
    >
      {pending ? (
        <>
          <ReloadIcon className="mr-2 size-4 animate-spin" />
          Please wait...
        </>
      ) : (
        text
      )}
    </Button>
  );
};

// SignIn Button for card
export const CardSignInButton = () => {
  return (
    <SignInButton mode="modal">
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="p-2 cursor-pointer"
        asChild
      >
        <FaRegHeart />
      </Button>
    </SignInButton>
  );
};

// Submit Button for card
export const CardSubmitButton = ({ isFavorite }: { isFavorite: boolean }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      size="icon"
      variant="outline"
      className="p-2 cursor-pointer"
    >
      {pending ? (
        <ReloadIcon className="animate-spin" />
      ) : isFavorite ? (
        <FaHeart />
      ) : (
        <FaRegHeart />
      )}
    </Button>
  );
};

type actionType = "edit" | "delete";

// Submit Button for actions (edit, delete)
export const IconButton = ({ type }: { type: actionType }) => {
  const { pending } = useFormStatus();

  const renderIcon = () => {
    switch (type) {
      case "edit":
        return <LuPenSquare className="text-primary size-5" />;
      case "delete":
        return <LuTrash2 className="text-destructive size-5" />;
      default:
        const never: never = type;
        throw new Error(`Invalid action type: ${never}`);
    }
  };

  return (
    <Button
      type="submit"
      disabled={pending}
      size="icon"
      variant="link"
      className="p-2 cursor-pointer"
    >
      {pending ? <ReloadIcon className="animate-spin" /> : renderIcon()}
    </Button>
  );
};
