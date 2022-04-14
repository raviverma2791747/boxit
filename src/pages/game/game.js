import React from 'react'
import { Container, Button, Row, Col } from 'react-bootstrap';
import Board from './board';
import { GameContext } from '../../context/gameContext';
import { useNavigate } from 'react-router-dom'

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function Game() {
    const navigate = useNavigate();
    const gameContext = React.useContext(GameContext);
    const [width, setWidth] = React.useState(0);

    const ref = React.useRef(null);


    const getSide = () => {
        setWidth(ref.current.offsetWidth);
    }

    React.useEffect(() => {
        getSide();
    });

    React.useEffect(() => {
        window.addEventListener("resize", getSide);
    })

    return (<Container>
        <Row>
            <Col ref={ref} className='d-flex flex-column  py-5' xs={12} sm={12} md={12} lg={4} >
                <div className='d-flex justify-content-between  mb-3 '>
                    <div><h5>Player Name: {gameContext.playerName}</h5></div>
                    <div ><h5>Room Id: {gameContext.roomId}</h5></div>
                </div>
                <div className='align-self-center'>
                    <Board size={10} side={width} />
                </div>
            </Col>
            <Col>
            </Col>
        </Row>
    </Container>
    )
}

export default Game