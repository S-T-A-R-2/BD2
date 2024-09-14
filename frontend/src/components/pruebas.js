//En la cosa de React oficial, Quick Start dice que las aplicaciones de React estan hechas por componentes, supongo qu esto cuenta como componente 
//Le pongo export para luego importarlo al archivo App.js
const validate_user = () => {
    var b;
  }
  export function Button({onClick, text, args = []}){
    if (args.length === 0){
      return (
        <button>{text}</button>
      );
    } else {
      return (
        <button onClick={() => onClick(...args)}>{text}</button>
      );
    }
    
  }
  /*const changeText = (oldText, newText) => {
    oldText = newText;
  }*/
  export function TextField({oldText, onChange}){
    return (
      <input type="text" onChange={e => onChange(e.target.value)}></input>
    );
  } 