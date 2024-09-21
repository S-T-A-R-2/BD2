import {couchDBCommit} from '../db.js'

export const createCommits = async (req, res) => {
    const response = await couchDBCommit.insert(req.body);
    res.json(response);
}

export const getCommits = async (req, res) => {
    const {id} = req.query;
    const query = { selector: { _id : id.id } }

    console.log(id);
    const commits = (await couchDBCommit.find(query));
    console.log(commits);
    res.json(commits.docs[0]);
}

export const updateCommits = async (req, res) => {
    const {commitsId} = req.params;
    const response = await couchDBCommit.insert(req.body, req.body._id);
    console.log("actualizó");
    console.log(req.body);
    res.json(response);
}