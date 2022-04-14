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
    const [action, setAction] = React.useState('');
    const gameContext = React.useContext(GameContext);
    let navigate = useNavigate();

    React.useEffect(() => {
        socket.on('joined', (payload) => {
            if (payload.joined) {
                gameContext.setPlayerName(playerName);
                gameContext.setRoomId(roomId);
                navigate('/game');
            } else {
                // setAction('not joined');
            }
        });
    });


    const onJoinRoom = () => {
        socket.emit('join', { roomId: roomId, playerName: playerName });
    }

    const onSubmit = (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {

        } else {
            if (action === 'create') {
                console.log('create')
            } else if (action === 'join') {
                console.log('join')
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