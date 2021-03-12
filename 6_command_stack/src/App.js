import './App.css';
import { useState } from 'react';
import Block from './components/Block';

const generateRandom = () => Math.floor(Math.random() * 100) + 50;

const blockMap = new Map();
blockMap.set("Block1", {
  id: "Block1",
  x: generateRandom(),
  y: generateRandom(),
  width: 200,
  height: 200,
  rotate: 0,
  bgColor: "red"
});
blockMap.set("Block2", {
  id: "Block2",
  x: generateRandom(),
  y: generateRandom(),
  width: 200,
  height: 200,
  rotate: 0,  
  bgColor: "blue"
});

/*
Commands
move(obj, startParent, endParent, x, y, startX, startY)
resize(obj, x, y, width, height, startX, startY, startWidth, startHeight)
rotate(obj, degrees, startDegrees)
delete(obj, startX, startY, startWidth, startHeight, startRotate)
*/

function App() {
  const [commandStack, setCommandStack] = useState([]);

  const [curCommand, setCurCommand] = useState('move');
  const [curObjName, setCurObjName] = useState('')
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [Blocks, setBlocks] = useState(blockMap);

  const clickHandler = e => {
    const { id } = e.target;
    if(id == null || id.length === 0) return;

    setCurObjName(id);
  };

  const selectChangeHandler = e => {
    const { value } = e.target;
    setCurCommand(value);
  };

  const changeInputHandler = action => e => action(1*e.target.value);

  const commandHandler = e => {
    if(curObjName == null || curObjName.length === 0) return;

    let { 
      x: startX, 
      y: startY, 
      width: startWidth,
      height: startHeight,
      rotate: startRotate
    } = blockMap.get(curObjName);
    
    let params = {};
    switch(curCommand) {
      case 'create':

        break;
      case 'delete':
        console.log('delete! should be filled in soon');
        params = { startX, startY, startWidth, startHeight, startRotate }
        blockMap.delete(curObjName);
        break;

      case 'move':
        params = { x, y, startX, startY }
        break;
      case 'resize':
        params = { x, y, width, height, startX, startY, startWidth, startHeight }
        break;
      case 'rotate':
        params = { rotate, startRotate }
        break;
      default: break;
    }

    if(curCommand !== 'delete') {
      blockMap.set(curObjName, {
        ...blockMap.get(curObjName),
        ...params
      });
    }

    setBlocks(new Map(blockMap));

    commandStack.push({ 
      command: curCommand,
      target: curObjName,
      ...params 
    });
    setCommandStack([...commandStack]);
    console.log(blockMap, commandStack);
  };

  const undoHandler = e => {
    if(commandStack.length === 0) return;

    let { command, target,
      startX, startY, startWidth, startHeight, 
      startRotate } =  commandStack.pop();
    let params = {};

    switch(command) {
      case 'create':

        break;
      case 'delete':
        break;

      case 'move':
        params = { x: startX, y: startY };
        break;
      case 'resize':
        params = { x: startX, y: startY, width: startWidth, height: startHeight };
        break;
      case 'rotate':
        params = { rotate: startRotate }
        break;
  
      default: break;
    }

    if(command !== 'delete') {
      blockMap.set(target, {
        ...blockMap.get(target),
        ...params
      });
    }

    setCommandStack([...commandStack]);
    setBlocks(new Map(blockMap));
  };

  const redoHandler = e => {
    console.log('Redo coming soon');

  };

  return (
    <div className="App" >
      <header>
        <input value={curObjName} disabled />
        <select value={curCommand} onChange={selectChangeHandler}>
          <option value="move">Move</option>
          <option value="resize">Resize</option>
          <option value="rotate">Rotate</option>
          <option value="delete">Delete</option>
        </select>
        <input className={ ['rotate', 'delete'].includes(curCommand) ? 'hide' : '' } defaultValue={x} onChange={changeInputHandler(setX)} />
        <input className={ ['rotate', 'delete'].includes(curCommand) ? 'hide' : '' } defaultValue={y} onChange={changeInputHandler(setY)}/>
        <input className={ curCommand !== 'resize' ? 'hide' : '' } defaultValue={width}  onChange={changeInputHandler(setWidth)} />
        <input className={ curCommand !== 'resize' ? 'hide' : '' } defaultValue={height} onChange={changeInputHandler(setHeight)} />
        <input className={ curCommand !== 'rotate' ? 'hide' : '' } defaultValue={rotate}  onChange={changeInputHandler(setRotate)} />
        <button onClick={commandHandler}>Run Command</button>
        <button onClick={undoHandler}>Undo</button>
        <button onClick={redoHandler}>Redo</button>
      </header>
      <div className="content" onClick={clickHandler}>
      { 
      Array.from(Blocks.entries() ).map( ([key, { id, x, y, rotate, width, height, bgColor }]) =>
       <Block key={key} id={id} x={x} y={y} width={width} height={height} rotate={rotate} bgColor={bgColor} />)
      }
      </div>
      <div className="CommandStack">
      {
        commandStack.map(({ command, target}, key) => <div key={key}>
          {command} {target}
        </div>)
      }
      </div>
    </div>
  );
}

export default App;
