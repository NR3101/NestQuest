"use client";

import { useState } from "react";
import { Card, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { LuMinus, LuPlus } from "react-icons/lu";

const CounterInput = ({
  detail,
  defaultValue,
}: {
  detail: string;
  defaultValue?: number;
}) => {
  const [count, setCount] = useState(defaultValue || 0);

  const increaseCount = () => {
    setCount((prev) => prev + 1);
  };

  const decreaseCount = () => {
    setCount((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <Card className="mb-4">
      {/* input for passing the value to the form */}
      <input type="hidden" name={detail} value={count} />

      <CardHeader className="flex flex-col gap-y-5">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex flex-col">
            <h2 className="font-medium capitalize">{detail}</h2>
            <p className="text-muted-foreground text-sm">
              Select the number of {detail}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={decreaseCount}
              variant="outline"
              size="icon"
              type="button"
            >
              <LuMinus className="size-5 text-primary" />
            </Button>
            <span className="text-xl font-bold w-5 text-center">{count}</span>
            <Button
              onClick={increaseCount}
              variant="outline"
              size="icon"
              type="button"
            >
              <LuPlus className="size-5 text-primary" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default CounterInput;
