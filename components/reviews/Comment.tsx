"use client";

import { useState } from "react";
import { Button } from "../ui/button";

const Comment = ({ comment }: { comment: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  const longComment = comment.length > 100;
  const displayComment =
    longComment && !isExpanded ? `${comment.slice(0, 100)}...` : comment;

  return (
    <div>
      <p className="text-sm">{displayComment}</p>
      {longComment && (
        <Button
          onClick={toggleExpanded}
          variant="link"
          className="pl-0 text-muted-foreground"
        >
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      )}
    </div>
  );
};
export default Comment;
