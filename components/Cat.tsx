import { useEffect, useState } from "react";
import { delayWhen, from, interval, map, mergeMap, repeat, tap } from "rxjs";
import { cn } from "../utils";

const regularBlink = [
  [
    [-60, 0],
    [0, 0],
  ],
];

const blushOffsetY = 0;
const blushOffsetX = -120;

const pawsOnlyOffsetY = -80;
const pawsOnlyOffsetX = 0;

export const Cat = ({
  blush,
  pawsOnly,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  pawsOnly: boolean;
  blush: boolean;
}) => {
  const [position, setPosition] = useState([0, 0]);

  // Could probably do this with css but i dont feel like it
  useEffect(() => {
    const blink = from(regularBlink)
      .pipe(
        mergeMap((x) =>
          from(x).pipe(
            map(([x, y]) => {
              let offsetY = 0;
              let offsetX = 0;

              if (blush) {
                offsetY += blushOffsetY;
                offsetX += blushOffsetX;
              }

              if (pawsOnly) {
                offsetY += pawsOnlyOffsetY;
                offsetX += pawsOnlyOffsetX;
              }

              return [x + offsetX, y + offsetY];
            }),
            repeat(Math.round(1 + Math.random() * 1))
          )
        ),
        delayWhen((_, idx) => interval(idx * 150)),
        tap(setPosition),
        delayWhen(() => interval(4000 + Math.round(Math.random() * 4000))),
        repeat()
      )
      .subscribe();

    return () => blink.unsubscribe();
  }, [pawsOnly, blush]);

  return (
    <div
      style={{
        background: `url(meester-sprites.svg) ${position
          .map((x) => x + "px")
          .join(" ")}`,
        height: 70,
        width: 50,
      }}
      aria-label="kitty ascii art"
      className={cn(className, "leading-tight")}
      {...rest}
    />
  );
};
