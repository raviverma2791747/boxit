import React from 'react'
import { Container, Card, Button, Form } from 'react-bootstrap'
import Header from '../../components/header'
import { socket } from '../../socket/socket.js'
import { useNavigate } from 'react-router-dom'
import { GameContext } from '../../context/gameContext'

const Home = () => {
    const [validated, setValidated] = React.useState(false)
    const [playerName, setPlayerName] = React.useState('');
    const [roomId, setRoomId] = React.useState('');
    const [roomLimit, setRoomLimit] = React.useState(2)
    const [action, setAction] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [boardSize,setBoardSize] = React.useState(10);
    const gameContext = React.useContext(GameContext);

    let navigate = useNavigate();

    const onJoinedRoom = (payload) => {
        if (payload.status) {
            gameContext.setPlayerName(playerName);
            gameContext.setRoomId(roomId);
            gameContext.setPlayers(payload.players);
            gameContext.setIsAdmin(payload.isAdmin);
            gameContext.setBoardSize(parseInt(payload.boardSize));
            gameContext.setColor(payload.color);
            navigate('/game')
        } else {
            setMessage(payload.message)
        }
    }

    const onCreateRoom = () => {
        socket.emit('create', { playerId: gameContext.playerId, roomId: roomId, playerName: playerName, roomLimit: roomLimit, boardSize: boardSize }, onJoinedRoom);
    }

    const onJoinRoom = () => {
        socket.emit('join', { playerId: gameContext.playerId, roomId: roomId, playerName: playerName }, onJoinedRoom);
    }

    const onSubmit = (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {

        } else {
            if (action === 'create') {
                onCreateRoom()
            } else if (action === 'join') {
                onJoinRoom();
            }
        }
        setValidated(true);
        e.preventDefault();
        e.stopPropagation();
    }

    return (
        <div className='d-flex flex-column flex-fill'>
            <Header />
            <Container className='flex-fill h-100 d-flex align-items-center  justify-content-center'>

                <Card>
                    <Card.Body className='p-4'>
                        <Card.Title className='text-center'>
                            Welcome to BoxIt!
                        </Card.Title>
                        <Form noValidate validated={validated} onSubmit={(e) => onSubmit(e)}>
                            <Form.Group className="mb-3" controlId="playerName">
                                <Form.Control value={playerName} onChange={(e) => setPlayerName(e.target.value)} type="text" placeholder="Player Name" required />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="roomId" >
                                <Form.Control value={roomId} onChange={(e) => setRoomId(e.target.value)} type="text" placeholder="Room ID" required />
                                <Form.Text muted>
                                    {message}
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="boardSize">
                                <Form.Select value={boardSize} onChange={(e) =>  setBoardSize(e.target.value)} >
                                <option key={2} value={2}>2</option>
                                    <option key={4} value={4}>4</option>
                                    <option key={6} value={6}>6</option>
                                    <option key={8} value={8}>8</option>
                                    <option key={10} value={10}>10</option>
                                </Form.Select>
                                <Form.Text muted>
                                    Board Size
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="roomLimit">
                                <Form.Select value={roomLimit} onChange={(e) => setRoomLimit(e.target.value)} >
                                    {
                                        Array(9).fill(0).map((item, key) => {
                                            return <option key={key} value={key + 2}>{key + 2}</option>
                                        })
                                    }
                                </Form.Select>
                                <Form.Text muted>
                                    Total Players
                                </Form.Text>
                            </Form.Group>
                            <Form.Group  >
                                <Button type='submit' name='action' value='create' onClick={() => setAction('create')} className='mb-3 me-3'>
                                    Create Room
                                </Button>
                                <Button type='submit' name='action' value='join' onClick={() => setAction('join')} className='mb-3'>
                                    Join Room
                                </Button>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>


            </Container>
        </div>
    )
}

export default Home