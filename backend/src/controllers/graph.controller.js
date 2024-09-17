import { connectNeo4J } from '../db.js';

export const createUser = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const operation = {
    operation: `
      MERGE (u:User {username: $username})
      RETURN u
    `,
    parameters: { username }
  };

  try {
    const result = await connectNeo4J(operation);
    const userNode = result.records[0].get('u');
    res.status(200).json({ message: 'User created', user: userNode });
  } catch (err) {
    console.error(`Error creating user: ${err}`);
    res.status(500).json({ error: 'Error creating user', details: err.message });
  }
};