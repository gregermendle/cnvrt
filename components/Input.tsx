import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
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
  self-stretch 
  overflow-hidden
  gap-3 
  rounded-lg 
  font-medium 
  outline-none 
  transition-shadow
  transition-opacity
  focus-within:ring 
  focus-within:ring-4 
  hover:text-gray-800
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

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  size?: keyof typeof Sizes;
  before?: ReactNode;
  after?: ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size = "md", className, before, after, ...rest }, ref) => {
    return (
      <div className={cn(Base, className)}>
        {before}
        <input
          ref={ref}
          {...rest}
          className={cn("outline-none bg-transparent", Sizes[size])}
        />
        <div className={cn("absolute right-2 pointer-events-none")}>
          {after}
        </div>
      </div>
    );
  }
);

export default Input;
