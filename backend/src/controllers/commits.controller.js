import {couchDBCommit} from '../db.js'

export const createCommits = async (req, res) => {
    const response = await couchDBCommit.insert(req.body);
    res.json(response);
}

export const getFileCommits = async (req, res) => {
    const {query} = req.query
    const filename = query.filename;
    const branch = query.branch
    try {
        const commits = await couchDBCommit.view('ViewsDocs', 'filesViews', { key: filename });
        const fileCommits = (commits.rows.find(b => b.id == branch));
        res.json(fileCommits.value);
    } catch (e) {
        res.json([]);
    }
    
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