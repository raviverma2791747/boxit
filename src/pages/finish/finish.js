import React from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { GameContext } from "../../context/gameContext";

const Finish = () => {
  const gameContext = React.useContext(GameContext);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!gameContext.start && !gameContext.finish) {
      navigate("/");
    }
  }, [gameContext.start, gameContext.finish]);


  return (
    <Container className="min-vh-100 d-flex justify-content-center align-items-center">
      <div>
        <h2 className="text-center">Leaderboard</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {gameContext.stats.players.map((player, index) => {
              return (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{ player.playerId === gameContext.playerId ? 'You' : player.playerName  }</td>
                  <td>{player.score}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default Finish;
