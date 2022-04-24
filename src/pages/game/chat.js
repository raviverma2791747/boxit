import React from "react";
import { Form, Button, InputGroup, Alert } from "react-bootstrap";
import { socket } from "../../socket/socket.js";
import { GameContext } from "../../context/gameContext";
import SendIcon from "@mui/icons-material/Send";

const Chat = () => {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const gameContext = React.useContext(GameContext);

  const onSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (message.length > 0) {
      let payload = {
        roomId: gameContext.roomId,
        playerId: gameContext.playerId,
        playerName: gameContext.playerName,
        message: message,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit("send-message", payload);
      setMessages([...messages, payload]);
      setMessage("");
    }
  };

  React.useEffect(() => {
    socket.on("joined", (payload) => {
      gameContext.setPlayers(payload.players);

      let msg = {
        roomId: payload.roomId,
        playerId: payload.player.playerId,
        playerName: payload.player.playerName,
        message: `${payload.player.playerName} joined the room`,
        time: new Date().toLocaleTimeString(),
      };

      setMessages([...messages, msg]);
    });
  });

  React.useEffect(() => {
    socket.on("left", (payload) => {
      gameContext.setPlayers(payload.players);

      let msg = {
        roomId: payload.roomId,
        playerId: payload.player.playerId,
        playerName: payload.player.playerName,
        message: `${payload.player.playerName} left the room`,
        time: new Date().toLocaleTimeString(),
      };

      setMessages([...messages, msg]);
    });
  });

  React.useEffect(() => {
    socket.on("receive-message", (payload) => {
      payload.time = new Date().toLocaleTimeString();
      setMessages([...messages, payload]);
    });
  });

  return (
    <div className="flex-fill d-flex flex-column  overflow-auto">
      <div className="flex-fill d-flex flex-column justify-content-end">
        {messages.map((msg, key) => {
          let today = new Date();
          if (msg.playerId === gameContext.playerId) {
            return (
              <Alert
                className="w-75 p-1 align-self-end"
                key={key}
                variant="success"
              >
                <Alert.Heading className="mb-0 " as="h6">
                  You
                </Alert.Heading>
                <p className="mb-0">{msg.message}</p>
                <p className="mb-0">{msg.time}</p>
              </Alert>
            );
          }
          return (
            <Alert className="w-75 p-1" key={key} variant="warning">
              <Alert.Heading className="mb-0" as="h6">
                {msg.playerName}
              </Alert.Heading>
              <p className="mb-0">{msg.message}</p>
              <p className="mb-0">{msg.time}</p>
            </Alert>
          );
        })}
      </div>
      <div className="position-sticky bottom-0 bg-white">
        <Form noValidate onSubmit={(e) => onSubmit(e)}>
          <InputGroup className="mb-3">
            <Form.Control
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Enter Message"
            />

            <Button type="submit">
              <SendIcon />
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
};

export default Chat;
