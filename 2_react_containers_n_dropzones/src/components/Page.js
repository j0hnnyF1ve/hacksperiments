/*
Pages can contain Blocks or Panels
*/
export default function Page({ id, 
    x=0, y=0, 
    width=800, height=600, 
    bgColor='#fff' 
  }) {

  const style = {
    backgroundColor: bgColor,
    left: x,
    top: y,
    width,
    height
  };

  return <div id={id} className="Page" style={style} draggable="true"></div>
};