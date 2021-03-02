import './App.css';

import { useState } from 'react';
import Page from './components/Page';

/*
Page
  Panel
    Block
  Block
*/

const random = size => Math.floor(Math.random() * size);

const createPage = ({ 
  id='Page' + random(100000), 
  x=0, 
  y=0, 
  width=800, 
  height=600, 
  bgColor,
  children=[] }) => 
  ({ id, x, y, width, height, children});

const createPanel = ({ 
  id='Panel' + random(100000), 
  x=random(100), 
  y=random(100), 
  width=200, 
  height=200, 
  bgColor,
  children=[] }) => 
  ({ id, x, y, width, height, children });

const createBlock = ({ 
  id='Block' + random(100000), 
  x=random(100), 
  y=random(100), 
  width=100, 
  height=100, 
  bgColor }) => 
  ({ id, x, y, width, height });
  

const initialPageState = {
  page: createPage({ 
    id: "Page1",
    width: 600,
    height: 400,
    children: [
      createPanel({ children: [ createBlock({ bgColor: 'red'}) ]}),
      createBlock({ bgColor: 'blue'})
    ]
  })
};


let curId = null;

function App() {
  const [PageState, setPageState] = useState(initialPageState);

  const mouseDownHandler = (e) => {
    if(e.target == null || e.target.id == null || e.target.id.length === 0) return;
    curId = e.target.id;
  };

  const mouseMoveHandler = (e) => {
    if(curId == null) return;

    const { clientX, clientY  } = e;
    const { offsetWidth, offsetHeight } = e.target;

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
      <Page id="Page" key="Page" state={PageState}>
      </Page>
    </div>
  );
}

export default App;
