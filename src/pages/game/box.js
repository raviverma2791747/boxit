import React from 'react'

const Box = ({ key, x, y, width, height, color, active, activeColor }) => {
    const style = {
        normal: {
            cursor: 'pointer',
            position: 'absolute',
            backgroundColor: active ? activeColor : color,
            height: height,
            width: width,
            top: x,
            left: y,
        }
    }

    return (
        <div key={key} style={style.normal} ></div>
    )
}

export default Box