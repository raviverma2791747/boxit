import React from "react";
import { Container, Button, Row, Col, Stack, Badge } from "react-bootstrap";
import Board from "./board";
import Chat from "./chat";
import { GameContext } from "../../context/gameContext";
import { useNavigate } from "react-router-dom";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { socket } from "../../socket/socket";

function Game() {
  const navigate = useNavigate();
  const gameContext = React.useContext(GameContext);

  React.useEffect(() => {
    if (gameContext.roomId === null) {
      navigate("/");
    }
  });

  React.useEffect(() => {
    socket.on("finish", (payload) => {
      gameContext.setFinish(true);
      gameContext.setStats(payload);
      socket.disconnect();
    });
  });

  React.useEffect(() => {
    socket.on("admin", (payload) => {
      gameContext.setIsAdmin(true);
    });
  });

  React.useEffect(() => {


  }, [
    gameContext.start,
    gameContext.turn,
    gameContext.finish,
    gameContext.isAdmin,
    gameContext.boardSize
  ]);

  React.useEffect(() => {
    socket.on("start", (payload) => {
      gameContext.setStart(true);
    });
  });

  const startGame = () => {
    socket.emit("start", { roomId: gameContext.roomId });
  };

  React.useEffect(() => {
    if (gameContext.finish) {
      navigate("/finish");
    }
  }, [gameContext.finish]);

  return (
    <Container className="py-3 vh-100">
      <Row className="justify-content-around h-100">
        <Col className="d-flex flex-column" xs={12} sm={12} md={12} lg={4}>
          <Stack className="mb-2" direction="horizontal" gap={3}>
            <div>
              <h6>{gameContext.playerName}</h6>
            </div>
            <div className="ms-auto">
              <h6>{gameContext.roomId}</h6>
            </div>
          </Stack>
          <div className="p-3">
            <Board size={gameContext.boardSize} />
          </div>
          <div className="mb-3">
            {gameContext.start
              ? gameContext.turn.playerId === gameContext.playerId
                ? "Your Turn"
                : `${gameContext.turn.playerName}'s Turn`
              : ""}
          </div>
          <div className="mb-3">
            {!gameContext.start && gameContext.isAdmin && (
              <Button variant="primary" onClick={() => startGame()}>
                Start
              </Button>
            )}
          </div>
          <div className="mb-3">
            <h6>Players</h6>
            <div className="d-flex flex-wrap">
              {gameContext.players.map((player, index) => {
                return (
                  <h4 className="me-1">
                    <Badge bg="secondary" key={index}>
                      {player.playerName}{" "}
                    </Badge>
                  </h4>
                );
              })}
            </div>
          </div>
        </Col>
        <Col className="d-flex flex-column" sm={12} lg={4}>
          <Chat />
        </Col>
      </Row>
    </Container>
  );
}

export default Game;
