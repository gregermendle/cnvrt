import { HTMLAttributes, ReactNode } from "react";
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

export type CardHeaderProps = {
  heading: ReactNode;
  subHeading: ReactNode;
} & HTMLAttributes<HTMLHeadingElement>;

export const CardHeader = ({
  className,
  heading,
  subHeading,
  ...rest
}: CardHeaderProps) => {
  return (
    <header className={cn("px-6 py-4", className)} {...rest}>
      <div className="text-2xl font-semibold text-gray-800">{heading}</div>
      <div className="text-md text-gray-500">{subHeading}</div>
    </header>
  );
};

export type CardFooterProps = {} & HTMLAttributes<HTMLDivElement>;

export const CardFooter = ({ className, ...rest }: CardFooterProps) => {
  return (
    <div
      {...rest}
      className={cn(
        "px-6 py-4 text-sm text-gray-500 border-t border-t-gray-300",
        className
      )}
    />
  );
};
