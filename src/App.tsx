import { Route, Routes } from "react-router-dom";

import Game2048 from "./games/2048";
import Home from "./pages/home/Home";
import Login from "./pages/auth/login/Login";
import Protected from "./layouts/Protected";
import Register from "./pages/auth/register/Register";
import Settings from "./pages/settings/Settings";
import TicTacToe2 from "./games/tic-tac-toe-2";
import Games from "./pages/games/Games";
import Minesweeper from "./games/minesweeper";
import Bookmarks from "./pages/bookmarks/Bookmarks";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} index />
      <Route
        path="/settings"
        element={<Protected type="logged-in-only" element={<Settings />} />}
      />
      <Route
        path="/auth/login"
        element={<Protected type="not-logged-in-only" element={<Login />} />}
      />
      <Route
        path="/auth/register"
        element={<Protected type="not-logged-in-only" element={<Register />} />}
      />

      <Route path="/games" element={<Games />} />
      <Route path="/bookmarks" element={<Bookmarks />} />
      {/* <Route
        path="/bookmarks"
        element={<Protected type="logged-in-only" element={<Bookmarks />} />}
      /> */}

      <Route path="/game/tic-tac-toe" element={<TicTacToe2 />} />
      <Route path="/game/2048" element={<Game2048 />} />
      <Route path="/game/minesweeper" element={<Minesweeper />} />
    </Routes>
  );
};

export default App;
