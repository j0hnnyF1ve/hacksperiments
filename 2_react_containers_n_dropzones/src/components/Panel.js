/*
Panels can contain Blocks, but not Panels or Pages
*/

export default function Panel({ id, x=0, y=0, bgColor='#b2fcff' }) {
  const style = {
    backgroundColor: bgColor,
    left: x,
    top: y
  };

  return <div id={id} className="Panel" style={style} draggable="true"></div>
};