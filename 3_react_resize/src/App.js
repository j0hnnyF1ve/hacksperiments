import './App.css';

import { useState } from 'react';
import Block from './components/Block';
import ResizeControl from './components/ResizeControl';

const blockMap = new Map();
blockMap.set("Block1", {
  id: "Block1",
  x: Math.floor(Math.random() * 100),
  y: Math.floor(Math.random() * 100),
  width: 200,
  height: 200,
  bgColor: "red"
});
blockMap.set("Block2", {
  id: "Block2",
  x: Math.floor(Math.random() * 100),
  y: Math.floor(Math.random() * 100),
  width: 200,
  height: 200,
  bgColor: "blue"
});

const initialResizeControlPos = {
  "UL": { x: 0, y: 0 },
  "LL": { x: 0, y: 40 },
  "UR": { x: 40, y: 0 },
  "LR": { x: 40, y: 40 }
};

let isDrag = false;

function App() {
  const [curId, setCurId] = useState(null);

  const [hideResizeControls, setHideResizeControls] = useState(true);
  const [resizeControlPos, setResizeControlPos] = useState(initialResizeControlPos)
  const [Blocks, setBlocks] = useState(blockMap);

  const mouseDownHandler = (e) => {

    if(e.target.className === "Block") {

      setCurId(e.target.id);

      setHideResizeControls(true);
      isDrag = true;
    } 
  };

  const mouseMoveHandler = (e) => {
    if(isDrag === false) return;

    const { clientX, clientY  } = e;
    const { offsetWidth, offsetHeight } = e.target;

    blockMap.set(curId, { 
      ...blockMap.get(curId),
      x: clientX - (offsetWidth / 4),
      y: clientY - (offsetHeight / 4)
    } );

    setBlocks(new Map(blockMap) );
  };

  const mouseUpHandler = (e) => {
    isDrag = false;

    if(curId == null) return;

    let { x, y, width, height } = blockMap.get(curId);

    const halfResizeBox = 10 / 2;
    setResizeControlPos({
      "UL": { x: x - halfResizeBox, y: y - halfResizeBox },
      "LL": { x: x - halfResizeBox, y: y*1 + height - halfResizeBox },
      "UR": { x: x*1 + width - halfResizeBox, y: y - halfResizeBox },
      "LR": { x: x*1 + width - halfResizeBox, y: y*1 + height - halfResizeBox }
    });
    setHideResizeControls(false);
  };

  const resizeHandler = (id, type) => (e) => {
    switch(type) {

      default:
        console.log(id, type);
        break;
    }
  };

  return (
    <div className="App" 
      onMouseDown={mouseDownHandler}
      onMouseMove={mouseMoveHandler}
      onMouseUp={mouseUpHandler}
      onDragStart={e => e.preventDefault() }
    >
      <div>{curId}</div>
      { 
      Array.from(Blocks.entries() ).map( ([key, { id, x, y, bgColor }]) =>
       <Block key={key} id={id} x={x} y={y} bgColor={bgColor} />)
      }

      {
        Object.entries(resizeControlPos).map( ([key, {x, y}]) => 
          <ResizeControl hide={hideResizeControls} key={key} resizeHandler={resizeHandler(curId, key)} target={curId} type={key} x={x} y={y} />
        )
      }

    </div>
  );
}

export default App;
