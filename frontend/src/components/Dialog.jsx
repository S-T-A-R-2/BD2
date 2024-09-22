import { act, forwardRef } from "react";
import {Input, Button} from '../components/Templates.js'
const Dialog = forwardRef(({ children, toggleDialog, action}, ref ) => {
    return (
        <dialog
            ref={ref}
            onClick={(e) => {
                console.log("Hola");
            }}
        >
            <div className='bg-zinc-800 m-auto text-white shadow-lg rounded-lg m-auto p-6 max-w-lg'>
                {children}
                <Button onClick={toggleDialog} text={"Cerrar"}/>
            </div>
        </dialog>
    );
});

export default Dialog;