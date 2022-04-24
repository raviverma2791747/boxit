import React from 'react'



const Edge = ({ key, x, y, height, width, active, color, activeColor, onClick }) => {
    const [hover, setHover] = React.useState(false);

    const style = {
        normal: {
            cursor: 'pointer',
            position: 'absolute',
            backgroundColor: active ? activeColor : color,
            height: height,
            width: width,
            top: x,
            left: y,
        },
        hover: {
            backgroundColor: activeColor
        }
    }

    return (<div key={key}
        onClick={active ? null : onClick}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        style={{ ...style.normal, ...(hover ? style.hover : null) }}>
    </div>)
}

export default Edge