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
let resizeType = '';
let startX = 0;
let startY = 0;
const HALFRESIZEBOX = 10 / 2;

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
      const { clientX, clientY  } = e;

      startX = clientX;
      startY = clientY; 
      isResize = true;
      
      // Needed for the type of resize to do on mousemove
      resizeType = e.target.dataset.type;

      // set start params before resizing
      const { x, y, width, height } = blockMap.get(curId);
      blockMap.set(curId, {
        ...blockMap.get(curId),
        startX: x,
        startY: y,
        startWidth: width,
        startHeight: height
      });
    }
    else {
      setHideResizeControls(true);
    }
  };

  const mouseMoveHandler = (e) => {
    e.preventDefault();

    const { clientX, clientY  } = e;

    if(isResize === true && curId != null) {
      let diffX = clientX - startX;
      let diffY = clientY - startY;

      const { x, y, startWidth, startHeight } = blockMap.get(curId);
      const { UL, UR, LL, LR } = resizeControlPos;

      let newControlPos = {
        UL: { ...UL },
        UR: { ...UR },
        LL: { ...LL },
        LR: { ...LR }
      };
      let newX, newY, newWidth, newHeight;

      switch(resizeType) {
        case "UL":
          newWidth = startWidth*1 - diffX;
          newHeight = startHeight*1 - diffY;
          newX = startX*1 + diffX;
          newY = startY*1 + diffY;

          newControlPos = { ...newControlPos,
            "UL": { x: clientX - HALFRESIZEBOX, y: clientY - HALFRESIZEBOX },
            "UR": { x: UR.x, y: clientY - HALFRESIZEBOX  },
            "LL": { x: clientX - HALFRESIZEBOX, y: LL.y  } 
          };
          break;
        case "LL":
          newWidth = startWidth*1 - diffX;
          newHeight = startHeight*1 + diffY;
          newX = startX*1 + diffX;
          newY = y*1;          

          newControlPos = { ...newControlPos,
            "UL": { x: clientX - HALFRESIZEBOX, y: UL.y },
            "LL": { x: clientX - HALFRESIZEBOX, y: clientY - HALFRESIZEBOX },
            "LR": { x: LR.x, y: clientY - HALFRESIZEBOX  } 
          };
          break;

        case "UR":
          newWidth = startWidth*1 + diffX;
          newHeight = startHeight*1 - diffY;
          newX = x*1;
          newY = startY*1 + diffY;

          newControlPos = { ...newControlPos,
            "UL": { x: UL.x, y: clientY - HALFRESIZEBOX },
            "UR": { x: clientX - HALFRESIZEBOX, y: clientY - HALFRESIZEBOX },
            "LR": { x: clientX - HALFRESIZEBOX, y: LR.y } 
          };

          break;
        case "LR":
          newWidth = startWidth*1 + diffX;
          newHeight = startHeight*1 + diffY;
          newX = x*1;
          newY = y*1;          

          // "UL": { x: x - HALFRESIZEBOX, y: y - HALFRESIZEBOX },
          // "LL": { x: x - HALFRESIZEBOX, y: y*1 + height - HALFRESIZEBOX },
          // "UR": { x: x*1 + width - HALFRESIZEBOX, y: y - HALFRESIZEBOX },
          // "LR": { x: x*1 + width - HALFRESIZEBOX, y: y*1 + height - HALFRESIZEBOX }

          newControlPos = { ...newControlPos,
            "LL": { x: LL.x, y: clientY - HALFRESIZEBOX },
            "UR": { x: clientX - HALFRESIZEBOX, y: UR.y },
            "LR": { x: clientX - HALFRESIZEBOX, y: clientY - HALFRESIZEBOX } 
          };
          break;
        default: break;
      }

      setResizeControlPos( newControlPos );      

      // Set the blockMap for the current object
      newWidth = newWidth > 50 ? newWidth : 50;
      newHeight = newHeight > 50 ? newHeight : 50;

      blockMap.set(curId, { 
        ...blockMap.get(curId),
        x: newX,
        y: newY,
        width:  newWidth,
        height: newHeight
      } );    

      setBlocks(new Map(blockMap) );

      return;
    }
    else if(isDrag === true) {
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = e.target;
      
      let newX = clientX - (offsetWidth / 2);
      if(newX <= 0) newX = clientX;

      let newY = clientY - (offsetHeight / 2);
      if(newY <= 0) newY = clientY;

      blockMap.set(curId, { 
        ...blockMap.get(curId),
        x: newX,
        y: newY
      } );
  
      setBlocks(new Map(blockMap) );
      return;
    }
  };

  const mouseUpHandler = (e) => {
    e.preventDefault();

    isDrag = false;
    isResize = false;

    if(curId == null) return;

    let { x, y, width, height } = blockMap.get(curId);

    setResizeControlPos({
      "UL": { x: x - HALFRESIZEBOX, y: y - HALFRESIZEBOX },
      "LL": { x: x - HALFRESIZEBOX, y: y*1 + height - HALFRESIZEBOX },
      "UR": { x: x*1 + width - HALFRESIZEBOX, y: y - HALFRESIZEBOX },
      "LR": { x: x*1 + width - HALFRESIZEBOX, y: y*1 + height - HALFRESIZEBOX }
    });

    if(["Block", "ResizeControl"].includes(e.target.className)) {
      setHideResizeControls(false);
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
      Array.from(Blocks.entries() ).map( ([key, { id, x, y, width, height, bgColor }]) =>
       <Block key={key} id={id} x={x} y={y} width={width} height={height} bgColor={bgColor} />)
      }

      {
        Object.entries(resizeControlPos).map( ([key, {x, y}]) => 
          <ResizeControl hide={hideResizeControls} key={key} target={curId} type={key} x={x} y={y} />
        )
      }

    </div>
  );
}

export default App;
