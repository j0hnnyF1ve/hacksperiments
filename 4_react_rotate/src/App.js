import './App.css';

import { useState, useEffect } from 'react';
import Block from './components/Block';
import ResizeControl from './components/ResizeControl';
import RotateControl from './components/RotateControl';

const blockMap = new Map();
blockMap.set("Block1", {
  id: "Block1",
  x: Math.floor(Math.random() * 100),
  y: Math.floor(Math.random() * 100),
  width: 200,
  height: 200,
  rotate: 0,
  bgColor: "red"
});
blockMap.set("Block2", {
  id: "Block2",
  x: Math.floor(Math.random() * 100),
  y: Math.floor(Math.random() * 100),
  width: 200,
  height: 200,
  rotate: 0,  
  bgColor: "blue"
});

const initialResizeControlPos = {
  "UL": { x: 0, y: 0 },
  "LL": { x: 0, y: 40 },
  "UR": { x: 40, y: 0 },
  "LR": { x: 40, y: 40 }
};

const initialRotateControlPos = { x: 0, y: 0 }

let isDrag = false;
let isResize = false;
let isRotate = false;
let resizeType = '';
let startX = 0;
let startY = 0;
const HALFRESIZEBOX = 10 / 2;

function App() {
  const [curId, setCurId] = useState(null);

  const [hideResizeControls, setHideResizeControls] = useState(true);
  const [hideRotateControls, setHideRotateControls] = useState(true);

  const [resizeControlPos, setResizeControlPos] = useState(initialResizeControlPos)
  const [rotateControlPos, setRotateControlPos] = useState(initialRotateControlPos)
  const [Blocks, setBlocks] = useState(blockMap);

  useEffect( () => {
    const { UL, LL, UR, LR } = resizeControlPos;
    console.log("useEffect", resizeControlPos, UL, LL, UR, LR);
  }, [resizeControlPos]);

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
    else if(e.target.className === "RotateControl") {
      isRotate = true;
    }
    else {
      setHideResizeControls(true);
      setHideRotateControls(true);
    }
  };

  const mouseMoveHandler = (e) => {
    e.preventDefault();

    const { clientX, clientY  } = e;
    const diffX = clientX - startX;
    const diffY = clientY - startY;

    if(isResize === true && curId != null) {
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
    else if(isRotate === true) {
      setRotateControlPos( { x: clientX, y: clientY } );      
  
      blockMap.set(curId, { 
        ...blockMap.get(curId),
        rotate: diffX % 360
      } );   

      setBlocks(new Map(blockMap) );
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
    isRotate = false;

    if(curId == null) return;

    let { x, y, width, height, rotate } = blockMap.get(curId);

    const radians = Math.PI * rotate / 180;
    const sin = Math.sin(radians);
    const cos = Math.cos(radians);

    const midpoint = { x: x*1 + (width / 2) - HALFRESIZEBOX, y: y*1 + (height / 2) - HALFRESIZEBOX };
    const half = { width: width/2, height: height/2 };

    console.log(rotate, midpoint, x, y);


    setResizeControlPos({
      "UL": { x: midpoint.x - half.width, y: midpoint.y - half.height },
      "LL": { x: midpoint.x - half.width, y: midpoint.y + half.height },
      "UR": { x: midpoint.x + half.width, y: midpoint.y - half.height },
      "LR": { x: midpoint.x + half.width, y: midpoint.y + half.height }

      // "UL": { x: x - HALFRESIZEBOX, y: y - HALFRESIZEBOX },
      // "LL": { x: x - HALFRESIZEBOX, y: y*1 + height - HALFRESIZEBOX },
      // "UR": { x: x*1 + width - HALFRESIZEBOX, y: y - HALFRESIZEBOX },
      // "LR": { x: x*1 + width - HALFRESIZEBOX, y: y*1 + height - HALFRESIZEBOX }
    });

    
    let newX = midpoint.x;
    let newY = midpoint.y;

    console.log(`degrees=${rotate}`, 
      `radians=${radians}`, 
      `sin=${Math.sin(radians)}`, 
      `cos=${Math.cos(radians)}`, 
      `x=${x}`, 
      `y=${y}`,
      `newX=${newX}`,
      `newY=${newY}`
    );


    // let newX = x*1 + (Math.sin(radians) * x) + (width / 2) - HALFRESIZEBOX;
    // let newY = y*1 + (Math.cos(radians) * y) + (height ) - HALFRESIZEBOX;

    /*
    midpoint=(100, 100)
    0 degrees=(100, 200)
    90 degrees=(0, 100)
    180 degrees=(100, 0)
    270 degrees=(200, 100)-
    */

    // 0 degrees - width / 2, height
    // 90 degrees - 0, height / 2
    // 180 degrees - width / 2, 0
    // 270 degrees - width, height / 2

    /*
      degrees=0, sin=0, cos=1 
      degrees=45, sin=0.7071067811865475, cos=0.7071067811865476 
      degrees=90, sin=1, cos=6.123233995736766e-17 
      degrees=135, sin=0.7071067811865476, cos=-0.7071067811865475 
      degrees=180, sin=1.2246467991473532e-16, cos=-1 
      degrees=225, sin=-0.7071067811865475, cos=-0.7071067811865477 
      degrees=270, sin=-1, cos=-1.8369701987210297e-16 
      degrees=315, sin=-0.7071067811865477, cos=0.7071067811865474 
      degrees=360, sin=-2.4492935982947064e-16, cos=1
    */


    setRotateControlPos({ x:  newX, y: newY });
    // setRotateControlPos({ x: x*1 + (width / 2) - HALFRESIZEBOX, y: y*1 + height - HALFRESIZEBOX + 40 });

    if(["Block", "ResizeControl", "RotateControl"].includes(e.target.className)) {
      setHideResizeControls(false);
      setHideRotateControls(false);
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
      Array.from(Blocks.entries() ).map( ([key, { id, x, y, rotate, width, height, bgColor }]) =>
       <Block key={key} id={id} x={x} y={y} width={width} height={height} rotate={rotate} bgColor={bgColor} />)
      }

      {
        Object.entries(resizeControlPos).map( ([key, {x, y}]) => 
          <ResizeControl hide={hideResizeControls} key={key} type={key} x={x} y={y} />
        )
      }

      <RotateControl hide={hideRotateControls} x={rotateControlPos.x} y={rotateControlPos.y} />
    </div>
  );
}

export default App;
