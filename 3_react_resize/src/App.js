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
let isResize = false;
let startX = 0;
let startY = 0;

function App() {
  const [curId, setCurId] = useState(null);

  const [hideResizeControls, setHideResizeControls] = useState(true);
  const [resizeControlPos, setResizeControlPos] = useState(initialResizeControlPos)
  const [Blocks, setBlocks] = useState(blockMap);

  const mouseDownHandler = (e) => {
    e.preventDefault();

    if(e.target.className === "Block") {

      setCurId(e.target.id);

      setHideResizeControls(true);
      isDrag = true;
    } 
    else if(e.target.className === "ResizeControl") {
      console.log(e.target, e.target.dataset.type);
      const { clientX, clientY  } = e;

      startX = clientX;
      startY = clientY; 
      isResize = true;
    }
    else {
      setHideResizeControls(true);
    }

  };

  const mouseMoveHandler = (e) => {
    e.preventDefault();

    const { clientX, clientY  } = e;

    if(isResize === true && curId != null) {
      if(e.target.className === "ResizeControl") {
        let diffX = clientX - startX;
        let diffY = clientY - startY;
        console.log(clientX - startX, clientY - startY);

        let { x, y, width, height } = blockMap.get(curId);

        switch(e.target.dataset.type) {
          case "UL":
            blockMap.set(curId, { 
              ...blockMap.get(curId),
            } );    
            break;
          case "LL":
            blockMap.set(curId, { 
              ...blockMap.get(curId),
            } );    
            break;
          case "UR":
            blockMap.set(curId, { 
              ...blockMap.get(curId),
            } );    
            break;
          case "LR":
            console.log(blockMap.get(curId), width, diffX);

            blockMap.set(curId, { 
              ...blockMap.get(curId),
              width: width*1 + diffX,
              height: height*1 + diffY
            } );    
            break;
          default: break;
        }
        setBlocks(new Map(blockMap) );
  
        return;
      }
    }
    else if(isDrag === true) {
      const { offsetWidth, offsetHeight } = e.target;
      
      blockMap.set(curId, { 
        ...blockMap.get(curId),
        x: clientX - (offsetWidth / 4),
        y: clientY - (offsetHeight / 4)
      } );
  
      setBlocks(new Map(blockMap) );
      return;
    }
  };

  const mouseUpHandler = (e) => {
    e.preventDefault();
    console.log("mouseUp");
    isDrag = false;
    isResize = false;

    if(curId == null) return;

    let { x, y, width, height } = blockMap.get(curId);

    const halfResizeBox = 10 / 2;
    setResizeControlPos({
      "UL": { x: x - halfResizeBox, y: y - halfResizeBox },
      "LL": { x: x - halfResizeBox, y: y*1 + height - halfResizeBox },
      "UR": { x: x*1 + width - halfResizeBox, y: y - halfResizeBox },
      "LR": { x: x*1 + width - halfResizeBox, y: y*1 + height - halfResizeBox }
    });

    if(["Block", "ResizeControl"].includes(e.target.className)) {
      setHideResizeControls(false);
    }
  };

  const resizeHandler = (id, type) => (e) => {
    console.log("resizeHandler", id, type, e);

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
