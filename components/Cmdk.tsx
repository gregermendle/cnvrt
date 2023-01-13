import { Command } from "cmdk";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Links } from "../constants";
import { cn } from "../utils";

export const CmdkContext = createContext<{
  isOpen: boolean;
  open: () => void;
} | null>(null);

export const useCmdk = () => {
  const ctx = useContext(CmdkContext);

  if (ctx === null) {
    throw new Error("useCmdk should be used within a Cmdk provider.");
  }

  return ctx;
};

export const Cmdk = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);

  const open = useCallback(() => setOpen(true), []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        e.stopPropagation();
        setOpen((currIsOpen) => {
          return !currIsOpen;
        });
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <CmdkContext.Provider value={{ isOpen, open }}>
      <div
        className={cn(
          !isOpen && "opacity-0",
          "fixed z-10 inset-0 bg-gray-400/50 backdrop-blur-md pointer-events-none transition-opacity"
        )}
      />
      <Command.Dialog
        defaultValue="/remix-links"
        open={isOpen}
        onOpenChange={setOpen}
        label="Global Command Menu"
        className={cn(`
          fixed
          top-1/2
          left-1/2
          -translate-y-1/2
          -translate-x-1/2
          rounded-xl
          overflow-hidden
          z-20
          max-w-xl
          w-full
          shadow-sm
        `)}
      >
        <Command.Input
          placeholder="Search cnvrt"
          className={cn(`
            w-full
            px-4 
            py-4 
            outline-none 
            mb-[1px]
            font-normal
            bg-white
            text-lg
          `)}
        />
        <Command.List className="h-72 overflow-y-auto px-2 bg-white">
          <Command.Empty className="text-gray-700 px-2 py-4 text-md">
            No tools match that name... yet.
          </Command.Empty>
          <Command.Group
            heading={<span className="block px-2 pb-1">Tools</span>}
            className="text-sm py-2 font-medium text-gray-600"
          >
            {Links.map((x) => (
              <Item
                key={x.href}
                value={x.href}
                onSelect={() => {
                  router.push(x.href);
                  setOpen(false);
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="200"
                    height="200"
                    rx="100"
                    className="fill-gray-200"
                  />
                  <path
                    d="M155.5 109.66H124.7C124.98 131.5 122.46 133.88 100.06 133.88C77.52 133.88 75 130.66 75 101.4C75 72.14 77.52 68.92 100.06 68.92C122.46 68.92 124.98 71.3 124.7 92.86H155.5C155.78 54.64 144.72 45.12 100.06 45.12C55.4 45.12 44.2 56.32 44.2 101.4C44.2 146.48 55.4 157.68 100.06 157.68C144.72 157.68 155.78 148.02 155.5 109.66Z"
                    className="fill-gray-500"
                  />
                </svg>
                <div>
                  <div className="font-medium text-gray-700">{x.title}</div>
                  <div className="font-normal text-gray-400">
                    {x.description}
                  </div>
                </div>
              </Item>
            ))}
          </Command.Group>
        </Command.List>
        <div className="flex items-center justify-end mt-[2px] gap-2 px-4 py-2 bg-white">
          <span className="font-normal text-sm text-gray-400">Open with</span>
          <div className="flex items-center gap-1 text-gray-700">
            <kbd className="kbd kbd-xs rounded-md bg-gray-100">⌘</kbd>
            <kbd className="kbd kbd-xs rounded-md bg-gray-100">k</kbd>
          </div>
        </div>
      </Command.Dialog>
      {children}
    </CmdkContext.Provider>
  );
};

export const Item = (props: {
  children: ReactNode;
  onSelect?: () => void;
  value: string;
}) => {
  return (
    <Command.Item
      className={cn(`
        text-md 
        font-normal 
        text-gray-800 
        flex
        items-center 
        gap-3 
        py-2 
        px-2
        hover:bg-gray-100
        rounded-md
        outline-none
        cursor-pointer
      `)}
      {...props}
    />
  );
};

export default Cmdk;
