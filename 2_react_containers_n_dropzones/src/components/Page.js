/*
Pages can contain Blocks or Panels
*/
import Block from './Block';
import Panel from './Panel';

export default function Page({ id, 
    x=0, y=0, 
    width=800, height=600, 
    bgColor='#fff',
    state={} 
  }) {

  const style = {
    backgroundColor: bgColor,
    left: x,
    top: y,
    width,
    height
  };

  console.log(state);

  return <div id={id} className="Page" style={style}>
    <Panel x={Math.floor(Math.random() * 100)} y={Math.floor(Math.random() * 100)}></Panel>
    <Block x={Math.floor(Math.random() * 100)} y={Math.floor(Math.random() * 100)}></Block>
  </div>
};