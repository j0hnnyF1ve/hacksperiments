export default function ResizeControl({
  hide=true,
  x,
  y,
  type
}) {

  const className = "ResizeControl" + ((hide === true) ? " hide" : "");

  const style = {
    left: x,
    top: y
  }

  return <div className={className} style={style} data-type={type}>
  </div>
};