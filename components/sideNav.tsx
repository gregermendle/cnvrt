import { ReactNode } from "react";

type NavItemProps = {
  primaryText: ReactNode;
  secondaryText: ReactNode;
};

function NavItem({ primaryText, secondaryText }: NavItemProps) {
  return (
    <div>
      <div className="font-bold">{primaryText}</div>
      <div>{secondaryText}</div>
    </div>
  );
}

export default function SideNav() {
  return (
    <nav className="w-40 flex flex-col gap-4">
      <NavItem
        primaryText="Remix Meta / Links"
        secondaryText="Convert html links and meta tags into Remix links and meta tags!"
      />
      <NavItem
        primaryText="Colors"
        secondaryText="Convert colors from hex to rgb or rgb to hex, etc. etc."
      />
    </nav>
  );
}
