import { Button, Container } from "react-bootstrap";
import { Routes, Route, HashRouter as Router } from "react-router-dom";
import { GameContext } from "./context/gameContext";
import React from "react";
import Home from "./pages/home/home";
import About from "./pages/about/about";
import Game from "./pages/game/game";
import Finish from "./pages/finish/finish";
import { socket } from "./socket/socket.js";

function App() {
  const [playerId, setPlayerId] = React.useState(null);
  const [roomId, setRoomId] = React.useState(null);
  const [playerName, setPlayerName] = React.useState(null);
  const [players, setPlayers] = React.useState([]);
  const [turn, setTurn] = React.useState({ playerId: "", playerName: "" });
  const [start, setStart] = React.useState(false);
  const [finish, setFinish] = React.useState(false);
  const [boardSize, setBoardSize] = React.useState(10);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [color, setColor] = React.useState("");
  const [stats,setStats]= React.useState();

  React.useEffect(() => {
    socket.on("connect", () => {
      setPlayerId(socket.id);
    });
  });

  return (
    <Router>
      <Container className="d-flex flex-column min-vh-100" fluid>
        <GameContext.Provider
          value={{
            playerId,
            roomId,
            playerName,
            players,
            turn,
            start,
            finish,
            boardSize,
            isAdmin,
            color,
            stats,
            setPlayerId,
            setRoomId,
            setPlayerName,
            setPlayers,
            setTurn,
            setStart,
            setFinish,
            setBoardSize,
            setIsAdmin,
            setColor,
            setStats
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/game" element={<Game />} />
            <Route path="/finish" element={<Finish />} />
          </Routes>
        </GameContext.Provider>
      </Container>
    </Router>
  );
}

export default App;
