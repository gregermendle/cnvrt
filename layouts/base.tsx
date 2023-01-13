import { ReactNode } from "react";
import Cmdk from "../components/Cmdk";

export default function Base({ children }: { children: ReactNode }) {
  return <Cmdk>{children}</Cmdk>;
}
