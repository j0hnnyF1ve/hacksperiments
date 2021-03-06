export default function RotateControl({
  hide=true,
  x,
  y
}) {

  const className = "RotateControl" + ((hide === true) ? " hide" : "");

  const style = {
    left: x,
    top: y
  }

  return <div className={className} style={style}>
  </div>
};