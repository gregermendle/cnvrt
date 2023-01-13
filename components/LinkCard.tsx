import { AnchorHTMLAttributes, forwardRef } from "react";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { cn } from "../utils";

export const Sizes = {
  sm: `px-3.5 py-2 text-md`,
  md: `px-4 py-2.5 text-md`,
  lg: `px-[18px] py-2.5 text-lg`,
  xl: `px-5 py-3 text-lg`,
  "2xl": `px-7 py-4 text-xl`,
};

export const Base = `
  flex 
  flex-col
  justify-center
  items-start 
  overflow-hidden
  rounded-lg 
  font-semibold 
  outline-none 
  transition-shadow
  transition-opacity
  focus:ring 
  focus:ring-2
  focus:text-primary-600
  hover:text-gray-800
  hover:bg-gray-50
  disabled:opacity-30 
  shadow-sm
  border 
  bg-white 
  border-gray-300 
  text-gray-700
  ring-primary-600
  font-medium
  relative
`;

export type LinkCardProps = {
  size?: keyof typeof Sizes;
} & NextLinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement>;

const LinkCard = forwardRef<HTMLAnchorElement, LinkCardProps>(
  ({ size = "md", className, ...rest }, ref) => {
    return (
      <NextLink
        ref={ref}
        {...rest}
        className={cn(Base, Sizes[size], className)}
      />
    );
  }
);

export default LinkCard;
