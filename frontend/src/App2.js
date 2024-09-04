// Frontend code 
// Filename - App.js
// Filename - App.js
import mongoose from 'mongoose'
import { useState } from 'react'
import Repository from './repository.model.js'
function App() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        let result = await fetch(
        'http://localhost:5000/register', {
            method: "post",
            body: JSON.stringify({ name, email }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        result = await result.json();
        console.warn(result);
        if (result) {
            alert("Data saved succesfully");
            setEmail("");
            setName("");
        }
    }

    let owner = "Gerald";
    //let name = "Repositorio";
    let files = [new mongoose.Types.ObjectId('66d75c4bb9b9ecd97d187c69')];
    /*const repSchema = {
        "owner:" {"type": "String", }

    }*/
    const cre = () => {
        const rep = new Repository(JSON.stringify({ owner, name, files }));
        rep.save();
      }

    const createRep = async (e) => {
        e.preventDefault();
        let result = await fetch(
        'http://localhost:5000/add', {
            method: "post",
            body: JSON.stringify({ owner, name, files }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        result = await result.json();
        console.warn(result);
        if (result) {
            alert("Data saved succesfully");
            setEmail("");
            setName("");
        }
    }
    return (
        <>
            <h1>This is React WebApp </h1>
            <form action="">
                <input type="text" placeholder="name" 
                value={name} onChange={(e) => setName(e.target.value)} />
                <input type="email" placeholder="email" 
                value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type="submit" 
                onClick={cre}>submit</button>
            </form>

        </>
    );
}

export default App;

