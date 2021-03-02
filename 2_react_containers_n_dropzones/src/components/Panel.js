/*
Panels can contain Blocks, but not Panels or Pages
*/

export default function Panel({ id, 
  x=0, y=0, 
  width=300, height=300, 
  bgColor='#b2fcff' 
}) {
  const style = {
    backgroundColor: bgColor,
    left: x,
    top: y,
    width, 
    height
  };

  return <div id={id} className="Panel" style={style} draggable="true"></div>
};