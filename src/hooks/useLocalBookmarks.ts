import { useSnackbar } from "notistack";
import { useLocalStorage } from "react-use";

export type BookmarkData = { title: string; href: string };
export const mappedBookmarks = new Map<string, BookmarkData>([
  ["tic-tac-toe", { title: "Kółko i krzyżyk", href: "/game/tic-tac-toe" }],
  ["2048", { title: "2048", href: "/game/2048" }],
  ["minesweeper", { title: "Saper", href: "/game/minesweeper" }],
]);

const useLocalBookmarks = () => {
  const [bookmarks, setBookmarks] = useLocalStorage<string[]>("bookmarks", []);
  const { enqueueSnackbar } = useSnackbar();

  const addBookmark = (gameId: string, skipSnackbar?: boolean) => {
    const newBookmarks = Array.from(new Set([...bookmarks!, gameId]));
    setBookmarks(newBookmarks);
    if (skipSnackbar) return;
    enqueueSnackbar({ variant: "success", message: "Dodano do zakładek" });
  };

  const removeBookmark = (gameId: string) => {
    const newBookmarks = bookmarks!.filter((bookmark) => bookmark !== gameId);
    setBookmarks(newBookmarks);

    // @ts-ignore
    enqueueSnackbar({
      variant: "undoChanges",
      message: "Cofnij usunięcie zakładki",
      autoHideDuration: 5000,
      anchorOrigin: { horizontal: "center", vertical: "bottom" },
      onUndo: () => addBookmark(gameId, true),
    });
  };

  const isBookmarked = (gameId: string) => {
    return bookmarks!.includes(gameId);
  };

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
};

export default useLocalBookmarks;
