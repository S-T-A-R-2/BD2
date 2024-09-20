//En la cosa de React oficial, Quick Start dice que las aplicaciones de React estan hechas por componentes, supongo qu esto cuenta como componente 
//Le pongo export para luego importarlo al archivo App.js
const validate_user = () => {
    var b;
  }
  export function Button({onClick, text, args = []}){
    if (args.length === 0){
      return (
        <button className="inline-flex px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none"
        onClick={() => onClick(...args)}>{text}</button>
      );
    } else {
      return (
        <button className="inline-flex px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none"
            onClick={() => onClick(...args)}>{text}</button>
      );
    }
}
  /*const changeText = (oldText, newText) => {
    oldText = newText;
  }*/
  export function Input({oldText, onChange, placeholder}){
    return (
      <input
          type="text"
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
      />
    );
  }