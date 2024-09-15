import {couchClient} from '../db.js'

export const createBranches = async (req, res) => {
    console.log(req.body);
    //var async = require('async');
    //const fs = require('fs');
    await couchClient.insert(req.body);
    res.json("hola");
}

export const getBranches = async (req, res) => {
    const {repositoryId} = req.query;
    const query = { selector: { _id : repositoryId } }
    const branches = (await couchClient.find(query));
    res.json(branches.docs);
    console.log(branches.docs);
}

export const updateBranches = async (req, res) => {
    const {id} = req.params;
    const response = await couchClient.insert(req.body, id);
    res.json(response);
}