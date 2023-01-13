import Button from "../components/Button";
import { useCmdk } from "../components/Cmdk";
import LinkCard from "../components/LinkCard";
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
          <svg
            className="text-gray-800"
            width="337"
            height="61"
            viewBox="0 0 337 61"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M59.816 34.9764H43.2632C43.4136 46.8122 42.0593 48.102 30.0209 48.102C17.9072 48.102 16.5529 46.357 16.5529 30.5C16.5529 14.643 17.9072 12.898 30.0209 12.898C42.0593 12.898 43.4136 14.1878 43.2632 25.8719H59.816C59.9665 5.1592 54.0225 0 30.0209 0C6.01922 0 0 6.06966 0 30.5C0 54.9303 6.01922 61 30.0209 61C54.0225 61 59.9665 55.7649 59.816 34.9764Z"
              fill="currentColor"
            />
            <path
              d="M74.8993 60.0896H90.6998V27.8445H91.1512L117.184 60.0896H132.082V0.91045H116.281V33.2313H115.83L89.8722 0.91045H74.8993V60.0896Z"
              fill="currentColor"
            />
            <path
              d="M206.388 0.91045H189.76L175.464 44.9154H175.013L161.846 0.91045H144.541L162.222 60.0896H187.202L206.388 0.91045Z"
              fill="currentColor"
            />
            <path
              d="M253.115 0.91045H219.558V60.0896H235.358V39.2251H247.096C255.297 39.2251 256.124 39.908 256.124 46.4328V60.0896H272.677V45.5224C272.677 37.9353 268.689 34.4453 260.864 33.6107C269.066 32.4726 272.677 27.8445 272.677 18.0572C272.677 4.32463 268.765 0.91045 253.115 0.91045ZM235.358 27.0858V13.8085H249.052C256.124 13.8085 256.877 14.4913 256.877 20.3333C256.877 26.403 256.124 27.0858 249.052 27.0858H235.358Z"
              fill="currentColor"
            />
            <path
              d="M303.067 60.0896H318.867V14.5672H337V0.91045H285.084V14.5672H303.067V60.0896Z"
              fill="currentColor"
            />
          </svg>
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
              <LinkCard href={x.href} className="w-72">
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
