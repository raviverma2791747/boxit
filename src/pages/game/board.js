import React from 'react'
import './box.css';
import Dot from './dot.js'
import Edge from './edge.js';
import { socket } from '../..//socket/socket';

const makeBoard = (N) => {
    let board = {
        box: Array((N - 1) * (N - 1)).fill(null),
        edge: []
    }

    let edge_id = 0;
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N - 1; j++) {
            board.edge.push({
                id: edge_id,
                v1: {
                    x: i,
                    y: j
                }, v2: {
                    x: i,
                    y: j + 1
                }, active: false
            })
            edge_id++;
        }
    }
    for (let i = 0; i < N - 1; i++) {
        for (let j = 0; j < N; j++) {
            board.edge.push({
                id: edge_id,
                v1: {
                    x: i,
                    y: j
                }, v2: {
                    x: i + 1,
                    y: j
                }, active: false
            })
            edge_id++;
        }
    }


    return board;
}


function Board({ size, side }) {
    const [board, setBoard] = React.useState(makeBoard(size));
    const [lock, setLock] = React.useState(false);
    const [P, setP] = React.useState(side / (size * 10));
    const [B, setB] = React.useState(side / size);

    React.useEffect(() => {
        setB(side / size);
        setP(side / (size * 10))
    })


    const updateEdge = (id, active) => {
        let newBoard = { ...board };
        for (let i = 0; i < newBoard.edge.length; i++) {
            if (newBoard.edge[i].id === id) {
                newBoard.edge[i].active = true;
                console.log(newBoard.edge[i]);
            }
        }
        setBoard(newBoard);
    }
    const onClickEdge = (id) => {
        if (lock) return;
        updateEdge(id, true);
        socket.emit('chat', { id: id });
        setLock(true);
    }

    React.useEffect(() => {
        socket.on('chat', (payload) => {
            console.log(payload);
            updateEdge(payload.id);
            setLock(false);
        })
    })

    return (
        <div style={{ position: 'relative', height: side, width: side, }}>
            {
                Array(size).fill(0).map((row, i) => {
                    return Array(size).fill(0).map((col, j) => {
                        return <Dot x={i} y={j} height={5} width={5} boxSize={B} color='black' />
                    })
                })
            }
            {


                board.edge.map((edge, key) => {
                    if (edge.v1.x === size - 1 && edge.v1.y === size - 1)
                        return <></>


                    if (edge.v1.x === edge.v2.x)
                        return <Edge key={key} onClick={() => onClickEdge(edge.id)} x={edge.v1.x * B} y={edge.v1.y * B + P} height={P} width={B - P} color='transparent' activeColor='red' active={edge.active} />


                    if (edge.v1.y === edge.v2.y)
                        return <Edge key={key} onClick={() => onClickEdge(edge.id)} x={edge.v1.x * B + P} y={edge.v1.y * B} height={B - P} width={P} color='transparent' activeColor='red' active={edge.active} />


                })
            }
        </div>)
}

export default Board