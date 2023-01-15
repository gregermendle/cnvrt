import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
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
  justify-center
  items-center 
  overflow-hidden
  gap-3 
  rounded-lg 
  font-normal 
  outline-none 
  transition-shadow
  transition-opacity
  focus:ring 
  focus:ring-2
  hover:text-gray-800
  hover:bg-gray-50
  disabled:opacity-30 
  shadow-sm
  border 
  bg-white 
  border-gray-300 
  text-gray-700
  ring-primary-600
  relative
`;

export type ButtonProps = {
  size?: keyof typeof Sizes;
  isPressed?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size = "md", className, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        {...rest}
        className={cn(Base, Sizes[size], className)}
      />
    );
  }
);

export default Button;
