import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Button, Input } from '../components/Templates.js';
import Editor from '@monaco-editor/react';
import { useAuth } from '../context/AuthContext';
import { getBranches, updateBranches } from '../api/auth.js';
import { useNavigate } from 'react-router-dom';

const FilePage = () => {
    const { fileId } = useParams();
    const location = useLocation();
    const [file, setFile] = useState(location.state?.file || null);
    const [repository, setRepository] = useState(location.state?.repository || null);
    const [branch, setBranch] = useState(null);
    const [branches, setBranches] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyTo, setReplyTo] = useState(null);
    const [currentComment, setCurrentComment] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        console.log('Repository:', repository); 
        const fetchBranches = async () => {
            if (repository) {
                try {
                    const response = await getBranches({ repositoryId: repository._id });
                    setBranches(response.data.branches);
                    console.log('Branches:', response.data.branches); 
                    if (response.data.branches.length > 0) {
                        setBranch(response.data.branches[0]);
                    }
                } catch (error) {
                    console.error('Error fetching branches:', error);
                }
            }
        };
        fetchBranches();
    }, [repository]);

    useEffect(() => {
        if (file) {
            if (file._attachments) {
                const attachmentKey = Object.keys(file._attachments)[0];
                const data = file._attachments[attachmentKey].data;
            }
            if (file.comments) {
                setComments(file.comments);
            }
        }
    }, [file, branch]);


    const logBranch = (branch, filename) => {
        if (!branch || !branch.files) {
            console.log("Branch or files not found.");
            return;
        }
    
        const logComments = (comments, level = 0) => {
            comments.forEach(comment => {
                console.log(' '.repeat(level * 2) + `Comment: ${comment.description} by ${comment.user} on ${comment.date}`);
                if (comment.comments && comment.comments.length > 0) {
                    logComments(comment.comments, level + 1);
                }
            });
        };
    
        branch.files.forEach(file => {
            if (file.filename === filename) {
                console.log(`File: ${file.filename}`);
                if (file.comments) {
                    logComments(file.comments);
                }
            }
        });
    };
    
    useEffect(() => {
        if (branch && file) {
            logBranch(branch, file.filename);
        }
    }, [branch, file]);


    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const navigate = useNavigate();


    const handlePostComment = async () => {
        if (newComment.trim() === "") {
            return;
        }
    
        const today = new Date();
        const date = today.toISOString().split('T')[0];
        const newCommentObj = {
            date: date,
            description: newComment,
            user: user.username,
            comments: []
        };
    
        let updatedComments;
        if (replyTo) {
            updatedComments = addNestedComment(comments, replyTo, newCommentObj);
        } else {
            updatedComments = [...comments, newCommentObj];
        }
    
        setComments(updatedComments);
        setNewComment("");
        setReplyTo(null);
    
        const updatedFile = { ...file, comments: updatedComments };
        setFile(updatedFile);
    
        const updatedBranch = { ...branch };
        const fileIndex = updatedBranch.files.findIndex(f => f.filename === file.filename);
        if (fileIndex !== -1) {
            updatedBranch.files[fileIndex] = updatedFile;
        }
    
        const updatedBranches = branches.map(b => b.name === branch.name ? updatedBranch : b);
        setBranches(updatedBranches);
    
        const updatedDocument = {
            ...repository,
            branches: updatedBranches,
            _rev: repository._rev
        };
    
        delete updatedDocument.__v;
    
        console.log('Updated Branch:', updatedBranch);
    
        try {
            await updateBranches(updatedDocument, repository._id);
        navigate(`/repository/${repository._id}`);
        setTimeout(() => {
            navigate(`/repository/${repository._id}/FilePage`, { state: { file: updatedFile, repository } });
        }, 0);
        } catch (error) {
            if (error.statusCode === 409) {
                console.error('Document update conflict. Please try again.');
            } else {
                console.error('Error updating branches:', error);
            }
        }
    };

    const addNestedComment = (comments, replyToDescription, newCommentObj) => {
        return comments.map(comment => {
            if (comment.description === replyToDescription) {
                return {
                    ...comment,
                    comments: [...comment.comments, newCommentObj]
                };
            } else if (comment.comments && comment.comments.length > 0) {
                return {
                    ...comment,
                    comments: addNestedComment(comment.comments, replyToDescription, newCommentObj)
                };
            }
            return comment;
        });
    };

    const handleReply = (description) => {
        setReplyTo(description);
    };

    const handleViewReplies = (comment) => {
        setCurrentComment(comment);
    };

    const decodeBase64 = (base64String) => {
        try {
            const decodedString = atob(base64String);
            return decodedString;
        } catch (e) {
            console.error("Failed to decode base64 string:", e);
            return "";
        }
    };

    const CommentsList = ({ comments, onReply, onViewReplies }) => {
        if (!comments || comments.length === 0) {
            return null;
        }
    
        const hasNestedComments = (comment) => {
            if (comment.comments && comment.comments.length > 0) {
                return true;
            }
            for (const nestedComment of (comment.comments || [])) {
                if (hasNestedComments(nestedComment)) {
                    return true;
                }
            }
            return false;
        };
    
        return (
        <div className="relative scroll-pb-6 size-[500px] max-h-96 overflow-y-auto">
            <ul role="list" className="p-4 divide-y divide-slate-100 bg-white text-black">
                {comments.map((comment, index) => (
                    <li key={index} className="group/item flex flex-col py-2 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-slate-900">Fecha de creación: {comment.date}</p>
                            <div className="flex space-x-2">
                                {hasNestedComments(comment) && (
                                    <a className="hover:bg-slate-200 ml-2" onClick={() => onViewReplies(comment)}>
                                        <button className="whitespace-nowrap">Respuestas</button>
                                    </a>
                                )}
                                <a className="hover:bg-slate-200 ml-2" onClick={() => onReply(comment.description)}>
                                    <button className="whitespace-nowrap">Responder</button>
                                </a>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-slate-900">Usuario: {comment.userId ? comment.userId : comment.user}</p>
                        <p className="text-sm font-medium text-slate-900 break-words max-h-24 overflow-auto">{comment.description}</p>
                    </li>
                ))}
            </ul>
        </div>
        );
    };

    return (
        <div className='relative text-white bg-zinc-800 flex flex-col m-auto h-screen overflow-hidden'>
        <div className="absolute top-0 right-0 ide-sm hide-md mb-1 d-flex flex-justify-between flex-items-center">
            <a href="/" className="group block w-30 h-25 text-black rounded-lg p-2 bg-white shadow-lg hover:bg-sky-500">                    
                <h3 className="flex space-x-3 text-slate-900 group-hover:text-white text-sm font-semibold">🏠 Volver a Página Principal</h3>    
            </a>
        </div>
        <div className="flex flex-row h-full mt-16 overflow-hidden"> 
            <div className="w-1/3 p-4 flex flex-col items-center">
                <div className="absolute top-0 left-0 p-4">
                    <h2 className="text-[24px]">Archivo Actual: {file ? file.filename : 'Cargando...'}</h2>
                    <p className="text-[20px]">Rama actual: {branch ? branch.name : 'Cargando...'}</p>
                </div>
                <div className="relative bg-zinc-800 rounded-md flex flex-col m-auto mt-4 h-full w-full">
                    <h1 className="text-center">Comentarios</h1>
                    {user && (
                        <>
                            <textarea
                                className="text-black p-2 rounded-md resize-none w-full"
                                placeholder="Escribe un comentario"
                                value={newComment}
                                onChange={handleCommentChange}
                                rows="3"
                            />
                            <button 
                                className="whitespace-nowrap overflow-hidden text-ellipsis bg-indigo-600 text-white py-2 px-4 rounded w-full mt-2" 
                                onClick={handlePostComment}
                            >
                                {replyTo ? `Responder a: ${replyTo}` : "Agregar Comentario"}
                            </button>
                        </>
                    )}
                    <div className="mt-4 flex-grow overflow-y-auto">
                        <CommentsList 
                            comments={currentComment ? currentComment.comments : comments} 
                            onReply={handleReply} 
                            onViewReplies={handleViewReplies} 
                        />
                    </div>
                </div>
            </div>
            <div className="w-2/3 p-4 flex justify-start items-center">
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