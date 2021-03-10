import './style.css'

const createNode = ({ id, left=250, top=250, width=10, height=10, bgColor='green'}) => {
  const el = document.createElement('div');
  
  if(id != null && id.length > 0) { el.id = id }
  el.style.position = 'absolute';
  el.style.left = `${left}px`;
  el.style.top = `${top}px`;
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
  el.style.backgroundColor = bgColor;
  el.style.border = 'solid 1px #000';

  return el;
}

let degrees = 0;
/*
  0 degrees: 250 300
  90 degrees: 200 250
  180 degrees: 250 200
  270 degrees: 300 250

  for(let rotate=0; rotate <= 360; rotate += 45) {
    let radians = Math.PI * rotate / 180;
    console.log(`degrees=${rotate}`, `sin(${rotate})=${Math.sin(radians)}`, `cos(${rotate})=${Math.cos(radians)}` );
  }
*/
const clickHandler = (e) => {
  const { clientX, clientY } = e;

  const center = document.getElementById('center');
  const point = document.getElementById('point');
  
  center.style.left = clientX + 'px';
  center.style.top = clientY + 'px';

  let { offsetLeft:centerLeft, offsetTop:centerTop } = center;
  let { offsetLeft:pointLeft, offsetTop:pointTop } = point;

  degrees = (degrees*1 + 15) % 360;
  let radians = Math.PI * degrees / 180;

  point.style.left = (centerLeft - (Math.sin(radians) * 50)) + 'px';
  point.style.top = (centerTop + (Math.cos(radians) * 50)) + 'px';

};

document.querySelector("#app").append( createNode({ id: 'center' }) );
document.querySelector("#app").append( createNode({ id: 'point', left: 250, top: 300, bgColor: 'red' }) );

document.body.addEventListener('click', clickHandler);