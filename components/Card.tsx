import { HTMLAttributes } from "react";
import { cn } from "../utils";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = ({ className, ...rest }: CardProps) => {
  return (
    <div
      className={cn(
        "rounded-md bg-white border border-gray-300 shadow-sm overflow-hidden",
        className
      )}
      {...rest}
    />
  );
};
