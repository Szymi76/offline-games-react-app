import { BookmarkX } from "lucide-react";
import { Button, Divider, Spacer } from "@nextui-org/react";
import useLocalBookmarks, {
  BookmarkData,
  mappedBookmarks,
} from "@/hooks/useLocalBookmarks";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useHoverDirty } from "react-use";

const Bookmarks = () => {
  const { bookmarks, removeBookmark } = useLocalBookmarks();

  return (
    <main className="mx-auto max-w-md px-5 pt-10">
      <h1 className="text-2xl font-bold">Zakładki</h1>
      <Spacer y={2} />
      <Divider />
      <Spacer y={4} />
      <div className="flex flex-col gap-1">
        {bookmarks!.map((gameId) => (
          <BookmarkItem
            key={gameId}
            gameId={gameId}
            onRemove={() => removeBookmark(gameId)}
            {...mappedBookmarks.get(gameId)!}
          />
        ))}
      </div>
    </main>
  );
};

export default Bookmarks;

type BookmarkItemProps = BookmarkData & {
  gameId: string;
  onRemove: (gameId: string) => void;
};
const BookmarkItem = (props: BookmarkItemProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const isHovering = useHoverDirty(ref);

  return (
    <Link
      key={props.title}
      to={props.href}
      className="flex items-center justify-between duration-100 hover:text-secondary"
    >
      <p className="font-semibold">{props.title}</p>
      <Button
        ref={ref}
        isIconOnly
        startContent={<BookmarkX />}
        variant="flat"
        color={isHovering ? "danger" : "default"}
        onPress={() => props.onRemove(props.gameId)}
      />
    </Link>
  );
};
