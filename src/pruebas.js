//En la cosa de React oficial, Quick Start dice que las aplicaciones de React estan hechas por componentes, supongo qu esto cuenta como componente 
//Le pongo export para luego importarlo al archivo App.js
export function Button(){
  return (
      <button>Botón épico</button>
  );
}

export function TextField(){
  return (
    <input type="text"></input>
  );
} 
