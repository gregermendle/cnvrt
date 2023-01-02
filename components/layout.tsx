import { ReactNode } from "react";
import SideNav from "./sideNav";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 grid-rows-[min-content_1fr_min-content] h-[100vh]">
      <header className="flex justify-between items-center h-12">
        <div>CNVRT</div>
      </header>
      <main className="grid grid-cols-[min-content_1fr] grid-rows-1 gap-8">
        <SideNav />
        <div>{children}</div>
      </main>
      <footer>hi i'm footer</footer>
    </div>
  );
}
