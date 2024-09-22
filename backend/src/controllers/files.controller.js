import {couchClient} from '../db.js'

export const createFile = async (req, res) => {
    console.log(req.body);
    //var async = require('async');
    //const fs = require('fs');
    await couchClient.insert(req.body);
}

export const getFiles = async (req, res) => {
    const {repositoryId} = req.query;
    const query = { selector: { _id : repositoryId } }
    const files = (await couchClient.find(query));
    res.json(files.docs);
    //console.log(files.docs)
}

export const deleteFile = async (req, res) => {
    const {fileId} = req.body;
    const {repositoryId, branchId} = req.query;
    try {
        couchClient.get(repositoryId, (err, body) => {

            //Se borra el archivo en el body

            //Se busca la rama actual
            body.branches.forEach(function(value,index,arr) {
                if (!value.name.localeCompare(branchId)) {
                    //Se busca el archivo actual
                    value.files.forEach(function(value1,index1) {
                        if (value1.filename == fileId){
                            console.log(value.files);
                            value.files.splice(index1,1);
                            console.log(value.files);
                        }
                    })
                }
            })
            //Se sobreescribe el objecto sin el archivo eliminado en la base de datos
            couchClient.insert(body);    
        });        
    } catch(err) {
        console.error("No se pudo borrar el archivo", err.message);
        res.status(500).json({ error: 'Error deleting file: ', details: err.message });
    }
}