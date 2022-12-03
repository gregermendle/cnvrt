import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return (
      <>
        <header>nav</header>
        <main>{children}</main>
        <footer>footer</footer>
      </>
    )
  }