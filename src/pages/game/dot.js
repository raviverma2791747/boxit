import React from 'react'

const Dot = ({ key, height, width, color, x, y , boxSize }) => {
    return (<div key={key} style={{ position: 'absolute', backgroundColor: color, height: height, width: width, top: x * boxSize, left: y * boxSize }}>
    </div>
    )
}

export default Dot