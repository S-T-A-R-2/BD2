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


// const testCouchDBConnection = async () => {
//     try {
//         const response = await couchClient.list({ include_docs: true });
//         console.log('Successfully connected to the test database. Documents:', response.rows);
//     } catch (error) {
//         console.error('Error connecting to the test database:', error);
//     }
// };

// // Run the test function
// testCouchDBConnection();

export const getBranches = async (req, res) => {
    const { repositoryId } = req.query;
    const query = { selector: { _id: repositoryId } };
    
    try {
        const branches = await couchClient.find(query);
        console.log('Branches response:', branches); // Log the entire response

        if (branches.docs && branches.docs[0] && branches.docs[0].branches) {
            console.log('Branches:', branches.docs[0].branches); // Log the branches array
            console.log('Files:', branches.docs[0].branches[0].files); // Log the files array
            console.log('Specific file:', branches.docs[0].branches[0].files[3]); // Log the specific file
            res.json(branches.docs[0]);
        } else {
            console.error('Branches not found in the response');
            res.status(404).json({ message: 'Branches not found' });
        }
    } catch (error) {
        console.error('Error fetching branches:', error);
        res.status(500).json({ message: 'Error fetching branches', error: error.message });
    }
};


// export const getBranches = async (req, res) => {
//     const {repositoryId} = req.query;
//     const query = { selector: { _id : repositoryId } }
//     const branches = (await couchClient.find(query));
//     //branches.docs[0].branches[0].files[3].content = await db.attachment.get(branches.docs[0]._id, files[3].filename);
//     console.log(branches.docs[0].branches[0].files[3]);
//     res.json(branches.docs[0]);
// }

export const updateBranches = async (req, res) => {
    const {id} = req.params;
    const response = await couchClient.insert(req.body, id);
    res.json(response);
}