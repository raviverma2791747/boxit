import { Button, Container } from 'react-bootstrap';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { GameContext } from './context/gameContext';
import React from 'react';
import Header from './components/header';
import Home from './pages/home/home';
import About from './pages/about/about';
import Game from './pages/game/game';


function App() {

  const [roomId, setRoomId] = React.useState(null);
  const [playerName, setPlayerName] = React.useState(null);


  return (
    <Router>
      <Container className='d-flex flex-column min-vh-100' fluid>
        <GameContext.Provider value={{ roomId, playerName, setRoomId, setPlayerName }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path='/game' element={<Game />} />
          </Routes>
        </GameContext.Provider>
      </Container>
    </Router>
  );
}

export default App;
