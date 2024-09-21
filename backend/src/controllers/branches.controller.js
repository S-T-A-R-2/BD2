import {couchClient} from '../db.js'

export const createBranches = async (req, res) => {
    console.log("Se creo la rama");
    console.log(req.body);
    const response = await couchClient.insert(req.body);
    res.json(response);
    
}

export const getBranches = async (req, res) => {
    const {repositoryId} = req.query;
    const query = { selector: { _id : repositoryId } }
    const branches = (await couchClient.find(query));
    //branches.docs[0].branches[0].files[3].content = await db.attachment.get(branches.docs[0]._id, files[3].filename);
    res.json(branches.docs[0]);
}

export const updateBranches = async (req, res) => {
    const {id} = req.params;
    const response = await couchClient.insert(req.body, id);
    res.json(response);
}
