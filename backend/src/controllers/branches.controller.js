import {couchClient} from '../db.js'

export const createBranches = async (req, res) => {
    console.log("Se creo la rama");
    console.log(req.body);
    
    try {
        const response = await couchClient.insert(req.body);
        console.log('Insertion response:', response); // Log the response from CouchDB
        res.json(response);
    } catch (error) {
        console.error('Error inserting into CouchDB:', error); // Log any errors
        res.status(500).json({ message: 'Error inserting into CouchDB', error: error.message });
    }
}


export const getBranches = async (req, res) => {
    const {repositoryId} = req.query;
    const query = { selector: { _id : repositoryId } }
    const branches = (await couchClient.find(query));
    //branches.docs[0].branches[0].files[3].content = await db.attachment.get(branches.docs[0]._id, files[3].filename);
    console.log(branches.docs[0].branches[0].files[3]);
    res.json(branches.docs[0]);
}

export const updateBranches = async (req, res) => {
    const { id } = req.params;
    const document = req.body;

    try {
        const response = await couchClient.insert(document, id);
        res.json(response);
    } catch (error) {
        if (error.statusCode === 409) {
            try {
                const latestDoc = await couchClient.get(id);
                document._rev = latestDoc._rev;
                const retryResponse = await couchClient.insert(document, id);
                res.json(retryResponse);
            } catch (retryError) {
                console.error('Error retrying document update:', retryError);
                res.status(500).json({ error: 'Error retrying document update', details: retryError.message });
            }
        } else {
            console.error('Error updating document:', error);
            res.status(500).json({ error: 'Error updating document', details: error.message });
        }
    }
};