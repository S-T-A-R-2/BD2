import {couchClient} from '../db.js'

export const createBranches = async (req, res) => {
    const response = await couchClient.insert(req.body);
    res.json(response);
    
}

export const getBranches = async (req, res) => {
    const {repositoryId} = req.query;
    const query = { selector: { _id : repositoryId } }
    const branches = (await couchClient.find(query));
    res.json(branches.docs[0]);
}

export const updateBranches = async (req, res) => {
    const {id} = req.params;
    const response = await couchClient.insert(req.body, id);
    res.json(response);
}
