export default function ResizeControl({
  hide=true,
  resizeHandler,
  x,
  y
}) {

  const className = "ResizeControl" + ((hide === true) ? " hide" : "");

  const style = {
    left: x,
    top: y
  }

  return <div className={className} style={style} onClick={resizeHandler}>
  </div>
};