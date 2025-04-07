import React, { useRef } from "react";
import BackButton from "@/components/BackButton";
import { Bookmark, BookmarkX } from "lucide-react";
import useLocalBookmarks from "@/hooks/useLocalBookmarks";
import { Button, Tooltip } from "@nextui-org/react";
import { useLocation } from "react-router-dom";
import { useHoverDirty } from "react-use";
import useDarkMode from "use-dark-mode";

type GameLayoutProps = { children: React.ReactNode };
const GameLayout = (props: GameLayoutProps) => {
  return (
    <main className="relative flex h-full min-h-screen items-center justify-center pb-3">
      {props.children}
      <BackButton />
      <BookmarkButton />
    </main>
  );
};

export default GameLayout;

const BookmarkButton = () => {
  const { addBookmark, removeBookmark, isBookmarked } = useLocalBookmarks();
  const ref = useRef<HTMLDivElement>(null);
  const isHovering = useHoverDirty(ref);
  const gameId = useLocation().pathname.split("/")[2];
  const isBook = isBookmarked(gameId);
  const isDarkMode = useDarkMode().value;

  const tooltipContent = isBook ? "Usuń zakładkę" : "Dodaj zakładkę";
  const color = isHovering ? (isBook ? "danger" : "warning") : "default";

  const handlePress = () => {
    if (isBook) removeBookmark(gameId);
    else addBookmark(gameId);
  };

  const fill = isDarkMode ? "white" : "black";

  return (
    <div ref={ref} className="absolute right-2 top-2">
      <Tooltip content={tooltipContent} placement="bottom-start">
        <Button
          isIconOnly
          startContent={
            isBook && isHovering ? (
              <BookmarkX />
            ) : (
              <Bookmark fill={isBook ? fill : "transparent"} />
            )
          }
          onPress={handlePress}
          color={color}
          variant="faded"
        />
      </Tooltip>
    </div>
  );
};
