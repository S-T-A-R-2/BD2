import {couchDBCommit} from '../db.js'

export const createCommits = async (req, res) => {
    const response = await couchDBCommit.insert(req.body);
    res.json(response);
}

export const getCommits = async (req, res) => {
    const {id} = req.query;
    const query = { selector: { _id : id.id } }
    const commits = (await couchDBCommit.find(query));
    res.json(commits.docs[0]);
}

export const updateCommits = async (req, res) => {
    const {commitsId} = req.params;
    console.log(req.body._id);
    const response = await couchDBCommit.insert(req.body, req.body._id);
    console.log(req.body);
    //res.json(response);
}