import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Button, Input } from '../components/Templates.js';
import Editor from '@monaco-editor/react';


const FilePage = () => {
    const { fileId } = useParams();
    const location = useLocation();
    const [file, setFile] = useState(location.state?.file || null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        if (file) {
            console.log("Received file:", JSON.stringify(file, null, 2));
            if (file._attachments) {
                const attachmentKey = Object.keys(file._attachments)[0]; // Get the key of the attachment
                const data = file._attachments[attachmentKey].data; // Access the data property
                console.log("Data:", data);
            } else if (file.content) {
                console.log("Content:", file.content);
            }
        }
    }, [file]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handlePostComment = () => {
        if (newComment.trim() === "") {
            return;
        }

        const today = new Date();
        const date = today.toISOString().split('T')[0];
        const newCommentObj = {
            date: date,
            description: newComment,
            user: user.username
        };

        setComments([...comments, newCommentObj]);
        setNewComment("");
    };

    const decodeBase64 = (base64String) => {
        try {
            const decodedString = atob(base64String);
            console.log("Decoded string:", decodedString);
            return decodedString;
        } catch (e) {
            console.error("Failed to decode base64 string:", e);
            return "";
        }
    };

    const CommentsList = ({ comments }) => {
        if (!comments || comments.length === 0) {
            return;
        }
    
        return (
            <div className="relative scroll-pb-6 size-[500px]">
                <ul role="list" className="p-6 divide-y divide-slate-100 bg-white text-black">
                    {comments.map((comment, index) => (
                        <li key={index} className="group/item flex py-4 first:pt-0 last:pb-0">
                            <div className="w-full cursor-pointer">
                                <p className="text-sm font-medium text-slate-900">Fecha de creación: {comment.date}</p>
                                <p className="text-sm font-medium text-slate-900">Usuario: {comment.userId}</p>
                                <p className="text-sm font-medium text-slate-900">{comment.description}</p>
                            </div>
                            <a className="group/edit invisible hover:bg-slate-200 group-hover/item:visible" onClick={e => console.log(comment.date)}>
                                <button>Descargar</button>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className='relative text-white bg-zinc-800 flex flex-col m-auto h-screen pt-16'>
            <div className="absolute top-0 right-0 ide-sm hide-md mb-1 d-flex flex-justify-between flex-items-center">
                <a href="/" className="group block w-30 h-25 text-black rounded-lg p-2 bg-white shadow-lg hover:bg-sky-500">                    
                    <h3 className="flex space-x-3 text-slate-900 group-hover:text-white text-sm font-semibold">🏠 Volver a Página Principal</h3>    
                </a>
            </div>
            <div className="flex flex-row h-full">
                <div className="w-1/2 p-4">
                    <div className="absolute top-0 left-0 p-4">
                        <h2 className="text-[24px]">Archivo Actual: {file ? file.filename : 'Cargando...'}</h2>
                    </div>
                    <div className="relative left-[20px] bg-zinc-800 rounded-md flex flex-col m-auto mt-16">
                        <h1>Comentarios</h1>
                        {user && (
                            <>
                                <textarea
                                    className="text-black p-2 rounded-md resize-none"
                                    placeholder="Escribe un comentario"
                                    value={newComment}
                                    onChange={handleCommentChange}
                                    rows="3"
                                />
                                <Button text="Agregar Comentario" onClick={handlePostComment} />
                            </>
                        )}
                        <div className="mt-4">
                            <CommentsList comments={file ? file.comments : []} />
                        </div>
                    </div>
                </div>
                <div className="w-1/2 p-4">
                    <Editor
                        height="80vh"
                        defaultLanguage="javascript"
                        value={file ? (file._attachments ? decodeBase64(file._attachments[Object.keys(file._attachments)[0]].data) : file.content || '') : ''}
                        options={{ readOnly: true }}
                    />
                </div>
            </div>
        </div>
    );
};


export default FilePage;