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