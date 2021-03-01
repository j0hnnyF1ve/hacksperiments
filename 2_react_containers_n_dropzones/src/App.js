import './App.css';

import { useState } from 'react';
import Block from './components/Block';
import Page from './components/Page';

const map = new Map();
map.set("Block1", {
  id: "Block1",
  x: Math.floor(Math.random() * 100),
  y: Math.floor(Math.random() * 100),
  bgColor: "red"
});
map.set("Block2", {
  id: "Block2",
  x: Math.floor(Math.random() * 100),
  y: Math.floor(Math.random() * 100),
  bgColor: "blue"
});

let curId = null;

function App() {
  const [Blocks, setBlocks] = useState(map);

  const mouseDownHandler = (e) => {
    if(e.target == null || e.target.id == null || e.target.id.length === 0) return;
    curId = e.target.id;
  };

  const mouseMoveHandler = (e) => {
    if(curId == null) return;

    const { clientX, clientY  } = e;
    const { offsetWidth, offsetHeight } = e.target;

    map.set(curId, { 
      ...map.get(curId),
      x: clientX - (offsetWidth / 4),
      y: clientY - (offsetHeight / 4)
    } );

    setBlocks(new Map(map) );
  };

  const mouseUpHandler = (e) => {
    curId = null;
  };

  return (
    <div className="App" 
      onMouseDown={mouseDownHandler}
      onMouseMove={mouseMoveHandler}
      onMouseUp={mouseUpHandler}
      onDragStart={e => e.preventDefault() }
    >
      <Page id="Page" key="Page" >
        { 
        Array.from(Blocks.entries() ).map( ([key, { id, x, y, bgColor }]) =>
        <Block key={key} id={id} x={x} y={y} bgColor={bgColor} />)
        }
      </Page>
    </div>
  );
}

export default App;
