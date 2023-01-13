import { ReactNode } from "react";

export type CardProps = {
  children: ReactNode;
};

export const Card = ({ children }: CardProps) => {
  return (
    <div className="rounded-md bg-white border border-gray-300 shadow-sm overflow-hidden">
      {children}
    </div>
  );
};
