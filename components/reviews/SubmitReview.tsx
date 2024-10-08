"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import FormContainer from "../form/FormContainer";
import { createReviewAction } from "@/utils/actions";
import RatingInput from "../form/RatingInput";
import TextAreaInput from "../form/TextAreaInput";
import { SubmitButton } from "../form/Buttons";

const SubmitReview = ({ propertyId }: { propertyId: string }) => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  return (
    <div className="mt-8">
      <Button onClick={() => setIsReviewFormOpen((prev) => !prev)}>
        Leave a Review
      </Button>

      {isReviewFormOpen && (
        <Card className="p-8 mt-8">
          <FormContainer action={createReviewAction}>
            <input type="hidden" name="propertyId" value={propertyId} />
            <RatingInput name="rating" />
            <TextAreaInput
              name="comment"
              labelText="your thoughts on this property"
              defaultValue="Amazing Place!!"
            />
            <SubmitButton text="submit" className="mt-4" />
          </FormContainer>
        </Card>
      )}
    </div>
  );
};
export default SubmitReview;
