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
      resizeType = e.target.dataset.type;

      const { width, height } = blockMap.get(curId);
      blockMap.set(curId, {
        ...blockMap.get(curId),
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

      let { x, y, width, height } = blockMap.get(curId);

      switch(resizeType) {
        // case "UL":
        //   blockMap.set(curId, { 
        //     ...blockMap.get(curId),
        //   } );    
        //   break;
        // case "LL":
        //   blockMap.set(curId, { 
        //     ...blockMap.get(curId),
        //   } );    
        //   break;
        // case "UR":
        //   blockMap.set(curId, { 
        //     ...blockMap.get(curId),
        //   } );    
        //   break;
        case "LR":

          const { startWidth, startHeight } = blockMap.get(curId);
          blockMap.set(curId, { 
            ...blockMap.get(curId),
            width: (startWidth*1 + diffX > 50) ? startWidth*1 + diffX : 50,
            height: (startHeight*1 + diffY > 50) ? startHeight*1 + diffY : 50
          } );    


          setResizeControlPos({ ...resizeControlPos, 
            "LL": { x: resizeControlPos["LL"].x, y: clientY - HALFRESIZEBOX },
            "UR": { x: clientX - HALFRESIZEBOX, y: resizeControlPos["UR"].y },
            "LR": { x: clientX - HALFRESIZEBOX, y: clientY - HALFRESIZEBOX } 
          });
          break;
        default: break;
      }

      setBlocks(new Map(blockMap) );

      return;
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
