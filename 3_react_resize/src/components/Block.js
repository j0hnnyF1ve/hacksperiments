
export default function Block({ id, 
  x=0, y=0, 
  width=200, height=200, 
  bgColor='#000' 
}) {
  const style = {
    backgroundColor: bgColor,
    left: x,
    top: y,
    width,
    height
  };

  return <div id={id} className="Block" style={style} draggable="true">
  </div>
};