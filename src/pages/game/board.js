import React from "react";
import "./box.css";
import Dot from "./dot.js";
import Edge from "./edge.js";
import { socket } from "../../socket/socket";
import Box from "./box";
import { GameContext } from "../../context/gameContext";

const makeBoard = (N) => {
  let board = {
    box: [],
    edge: [],
  };

  let box_id = 0;
  for (let i = 0; i < N - 1; i++) {
    for (let j = 0; j < N - 1; j++) {
      board.box.push({ x: i, y: j, id: box_id, active: false, color: null });
    }
  }

  let edge_id = 0;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N - 1; j++) {
      board.edge.push({
        id: edge_id,
        v1: {
          x: i,
          y: j,
        },
        v2: {
          x: i,
          y: j + 1,
        },
        active: false,
        color: null,
      });
      edge_id++;
    }
  }
  for (let i = 0; i < N - 1; i++) {
    for (let j = 0; j < N; j++) {
      board.edge.push({
        id: edge_id,
        v1: {
          x: i,
          y: j,
        },
        v2: {
          x: i + 1,
          y: j,
        },
        active: false,
        color: null,
      });
      edge_id++;
    }
  }

  return board;
};

function Board({ size }) {
  const [board, setBoard] = React.useState(makeBoard(size));
  const [loading, setLoading] = React.useState(true);
  const gameContext = React.useContext(GameContext);
  const [side, setSide] = React.useState(0);
  const [P, setP] = React.useState(side / (size * 10));
  const [B, setB] = React.useState(side / size);
  const ref = React.useRef(null);
  const getSide = () => {
    setSide(ref.current.offsetWidth);
  };

  React.useEffect(() => {
    getSide();
  });

  React.useEffect(() => {
    window.addEventListener("resize", getSide);
  });

  React.useEffect(() => {}, [ref]);

  const updateBox = (x, y, active, color) => {
    let newBoard = { ...board };
    newBoard.box.filter((box) => {
      return (
        box.x === x &&
        box.y === y &&
        (box.active = active) &&
        (box.color = color)
      );
    });
    setBoard(newBoard);
  };

  const updateEdge = (id, active, color) => {
    let newBoard = { ...board };
    let edge = null;
    for (let i = 0; i < newBoard.edge.length; i++) {
      if (newBoard.edge[i].id === id) {
        newBoard.edge[i].active = active;
        newBoard.edge[i].color = color;
        edge = newBoard.edge[i];
      }
    }
    setBoard(newBoard);
    checkBoxClosed(edge, color);
  };

  const probeDown = (x, y) => {
    return board.edge.filter((e) => {
      if (e.v1.x === x && e.v1.y === y && e.v2.x === x + 1 && e.v2.y === y) {
        return e.active;
      }
      return false;
    }).length === 0
      ? false
      : true;
  };

  const probeRight = (x, y) => {
    return board.edge.filter((e) => {
      if (e.v1.x === x && e.v1.y === y && e.v2.x === x && e.v2.y === y + 1) {
        return e.active;
      }
      return false;
    }).length === 0
      ? false
      : true;
  };

  const probe = (x, y) => {
    return (
      probeDown(x, y) &&
      probeDown(x, y + 1) &&
      probeRight(x, y) &&
      probeRight(x + 1, y)
    );
  };

  const checkBoxClosed = (edge, color) => {
    if (!edge) return;

    if (edge.v1.x === 0) {
      if (probe(edge.v1.x, edge.v1.y)) {
        updateBox(edge.v1.x, edge.v1.y, true, color);
      }
      if (probe(edge.v1.x, edge.v1.y - 1)) {
        updateBox(edge.v1.x, edge.v1.y - 1, true, color);
      }
    } else if (edge.v1.y === 0) {
      if (probe(edge.v1.x, edge.v1.y)) {
        updateBox(edge.v1.x, edge.v1.y, true, color);
      }
      if (probe(edge.v1.x - 1, edge.v1.y)) {
        updateBox(edge.v1.x - 1, edge.v1.y, true, color);
      }
    } else if (edge.v1.x === size - 1) {
      if (probe(edge.v1.x - 1, edge.v1.y)) {
        updateBox(edge.v1.x - 1, edge.v1.y, true, color);
      }
    } else if (edge.v1.y === size - 1) {
      if (probe(edge.v1.x, edge.v1.y - 1)) {
        updateBox(edge.v1.x, edge.v1.y - 1, true, color);
      }
    } else if (edge.v1.x === edge.v2.x) {
      if (probe(edge.v1.x - 1, edge.v1.y)) {
        updateBox(edge.v1.x - 1, edge.v1.y, true, color);
      }
      if (probe(edge.v1.x, edge.v1.y)) {
        updateBox(edge.v1.x, edge.v1.y, true, color);
      }
    } else if (edge.v1.y === edge.v2.y) {
      if (probe(edge.v1.x, edge.v1.y - 1)) {
        updateBox(edge.v1.x, edge.v1.y - 1, true, color);
      }
      if (probe(edge.v1.x, edge.v1.y)) {
        updateBox(edge.v1.x, edge.v1.y, true, color);
      }
    }
  };

  const onClickEdge = (id) => {
    if (gameContext.turn.playerId === gameContext.playerId) {
      updateEdge(id, true, gameContext.color);
      socket.emit("report-move", {
        roomId: gameContext.roomId,
        playerId: gameContext.playerId,
        edgeId: id,
      });
    }
  };

  React.useEffect(() => {
    setB(side / size);
    setP(side / (size * 10));
  }, [size, side]);

  React.useEffect(() => {
    if (gameContext.roomId !== null) {
      setLoading(false);
    }
  }, [gameContext.roomId]);

  React.useEffect(() => {
    socket.on("move", (payload) => {
      updateEdge(payload.edgeId, true, payload.player.color);
    });
  });

  React.useEffect(() => {
    socket.on("turn", (payload) => {
      gameContext.setTurn(payload);
    });
  });

  React.useEffect(() => {
    if (!loading) {
      socket.emit("get-board", { roomId: gameContext.roomId }, (payload) => {
        if (payload.board !== null) {
          setBoard(payload.board);
        }
      });
    }
  }, [loading, gameContext.roomId]);

  return (
    <div ref={ref} className="w-100">
      <div style={{ position: "relative", height: side }}>
        {board.box.map((box, key) => {
          return (
            <Box
              key={key}
              x={box.x * B + P}
              y={box.y * B + P}
              height={B - P}
              width={B - P}
              activeColor={box.color ? box.color : gameContext.color}
              active={box.active}
            />
          );
        })}
        {Array(size)
          .fill(0)
          .map((row, i) => {
            return Array(size)
              .fill(0)
              .map((col, j) => {
                return (
                  <Dot
                    x={i}
                    y={j}
                    height={P}
                    width={P}
                    boxSize={B}
                    color="black"
                  />
                );
              });
          })}
        {board.edge.map((edge, key) => {
          if (edge.v1.x === edge.v2.x)
            return (
              <Edge
                key={key}
                onClick={() => onClickEdge(edge.id)}
                x={edge.v1.x * B}
                y={edge.v1.y * B + P}
                height={P}
                width={B - P}
                color="transparent"
                activeColor={edge.color ? edge.color : gameContext.color}
                active={edge.active}
              />
            );

          if (edge.v1.y === edge.v2.y)
            return (
              <Edge
                key={key}
                onClick={() => onClickEdge(edge.id)}
                x={edge.v1.x * B + P}
                y={edge.v1.y * B}
                height={B - P}
                width={P}
                color="transparent"
                activeColor={edge.color ? edge.color : gameContext.color}
                active={edge.active}
              />
            );

          return <></>;
        })}
      </div>
    </div>
  );
}

export default Board;
