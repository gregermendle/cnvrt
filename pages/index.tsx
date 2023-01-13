import Button from "../components/Button";
import { useCmdk } from "../components/Cmdk";
import LinkCard from "../components/LinkCard";
import Logo from "../components/Logo";
import { Links } from "../constants";

export default function Home() {
  const { open } = useCmdk();

  return (
    <>
      <header className="flex justify-end items-center h-14 px-6">
        <a href="https://github.com/gregermendle/cnvrt" target="__blank">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20.375 8.174C20.538 7.774 21.063 6.187 20.212 4.037C20.212 4.037 18.9 3.624 15.912 5.662C14.662 5.312 13.325 5.262 12 5.262C10.675 5.262 9.338 5.312 8.088 5.662C5.1 3.612 3.788 4.037 3.788 4.037C2.938 6.187 3.463 7.774 3.625 8.174C2.612 9.262 2 10.662 2 12.362C2 18.799 6.162 20.249 11.975 20.249C17.788 20.249 22 18.799 22 12.362C22 10.662 21.387 9.262 20.375 8.174ZM12 19.024C7.875 19.024 4.525 18.837 4.525 14.837C4.525 13.887 5 12.987 5.8 12.249C7.138 11.024 9.425 11.674 12 11.674C14.588 11.674 16.85 11.024 18.2 12.249C19.013 12.987 19.475 13.874 19.475 14.837C19.475 18.824 16.125 19.024 12 19.024V19.024ZM8.863 12.762C8.038 12.762 7.363 13.762 7.363 14.987C7.363 16.212 8.037 17.224 8.863 17.224C9.688 17.224 10.363 16.224 10.363 14.987C10.363 13.749 9.688 12.762 8.863 12.762ZM15.137 12.762C14.312 12.762 13.637 13.749 13.637 14.987C13.637 16.224 14.312 17.224 15.137 17.224C15.962 17.224 16.637 16.224 16.637 14.987C16.637 13.749 15.975 12.762 15.137 12.762Z"
              fill="currentColor"
            />
          </svg>
        </a>
      </header>
      <main className="flex flex-col max-w-4xl w-full mx-auto px-6 gap-20">
        <div className="flex flex-col items-center justify-center mt-48 gap-20">
          <Logo />
          <Button
            size="xl"
            className="max-w-md w-full justify-between"
            onClick={open}
          >
            <span className="text-gray-400">Search cnvrt</span>
            <div className="flex items-center gap-1 text-gray-700">
              <kbd className="kbd kbd-xs rounded-md bg-gray-100">⌘</kbd>
              <kbd className="kbd kbd-xs rounded-md bg-gray-100">k</kbd>
            </div>
          </Button>
        </div>
        <div>
          <header className="text-gray-800 leading-tight border-b border-b-gray-300 pb-2 mb-6">
            <div className="font-semibold text-lg">Tools</div>
            <p className="text-gray-600 text-md">
              Hopefully these can be of use to you :)
            </p>
          </header>
          <div className="flex flex-wrap gap-4">
            {Links.map((x) => (
              <LinkCard href={x.href} className="w-72" key={x.href}>
                <div>{x.title}</div>
                <div className="text-gray-600 font-normal">{x.description}</div>
              </LinkCard>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
