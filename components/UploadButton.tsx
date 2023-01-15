import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../utils";

export type UploadButtonProps = {
  isDragging?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const UploadButton = forwardRef<HTMLButtonElement, UploadButtonProps>(
  ({ className, children, isDragging, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        {...rest}
        className={cn(
          "relative overflow-visible flex items-center justify-center gap-4 p-6 py-4 rounded-md bg-primary-100 text-primary-800 font-semibold my-2 w-full border-2 border-primary-400 hover:shine",
          isDragging && "shine",
          className
        )}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21ZM5 21L16 10L21 15M10 8.5C10 9.32843 9.32843 10 8.5 10C7.67157 10 7 9.32843 7 8.5C7 7.67157 7.67157 7 8.5 7C9.32843 7 10 7.67157 10 8.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {children}
      </button>
    );
  }
);

export default UploadButton;
