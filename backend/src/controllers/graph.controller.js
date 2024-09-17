import { connectNeo4J } from '../db.js';


// Create a user node
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

// Create a repository node and OWNS relationship
export const createRepository = async (req, res) => {
  const { owner, name } = req.body;

  console.log(owner);

  if (!owner || !name) {
    return res.status(400).json({ error: 'Username and repository name are required' });
  }

  const operation = {
    operation: `
      MATCH (u:User {username: $owner})
      MERGE (r:Repository {name: $name})
      MERGE (u)-[:OWNS]->(r)
      RETURN u, r
    `,
    parameters: { owner, name }
  };

  try {
    const result = await connectNeo4J(operation);
    const userNode = result.records[0].get('u');
    const repositoryNode = result.records[0].get('r');
    res.status(200).json({ message: 'Repository created and relationship OWNS established', user: userNode, repository: repositoryNode });
  } catch (err) {
    console.error(`Error creating repository and relationship: ${err}`);
    res.status(500).json({ error: 'Error creating repository and relationship', details: err.message });
  }
};

// User LIKES Repository
export const userLikesRepository = async (req, res) => {
  const { username, repositoryName } = req.body;
  if (!username || !repositoryName) {
    return res.status(400).json({ error: 'Username and repository name are required' });
  }

  const operation = {
    operation: `
      MATCH (u:User {username: $username})
      MATCH (r:Repository {name: $repositoryName})
      MERGE (u)-[:LIKES]->(r)
      RETURN u, r
    `,
    parameters: { username, repositoryName }
  };

  try {
    const result = await connectNeo4J(operation);
    res.status(200).json({ message: 'User likes repository', result: result.records });
  } catch (err) {
    console.error(`Error creating relationship: ${err}`);
    res.status(500).json({ error: 'Error creating relationship', details: err.message });
  }
};

// User FOLLOWs Repository
export const userFollowsRepository = async (req, res) => {
  const { username, repositoryName } = req.body;

  const operation = {
    operation: `
      MATCH (u:User {username: $username})
      MATCH (r:Repository {name: $repositoryName})
      MERGE (u)-[:FOLLOWS]->(r)
      RETURN u, r
    `,
    parameters: { username, repositoryName }
  };

  try {
    const result = await connectNeo4J(operation);
    res.status(200).json({ message: 'User follows repository', result: result.records });
  } catch (err) {
    console.error(`Error creating relationship: ${err}`);
    res.status(500).json({ error: 'Error creating relationship', details: err.message });
  }
};

// Create a comment and link it to a repo with the user who made it
export const createCommentOnRepository = async (req, res) => {
  const { username, description, repositoryName } = req.body;

  if (!username || !description || !repositoryName) {
    return res.status(400).json({ error: 'Username, description, and repository name are required' });
  }

  const operation = {
    operation: `
      MATCH (u:User {username: $username})
      MATCH (r:Repository {name: $repositoryName})
      CREATE (c:Comment {description: $description})
      MERGE (u)-[:MADE]->(c)
      MERGE (c)-[:COMMENTS]->(r)
      RETURN u, c, r
    `,
    parameters: { username, description, repositoryName }
  };

  try {
    const result = await connectNeo4J(operation);
    const userNode = result.records[0].get('u');
    const commentNode = result.records[0].get('c');
    const repositoryNode = result.records[0].get('r');
    res.status(200).json({ message: 'Comment created and linked to repository and user', user: userNode, comment: commentNode, repository: repositoryNode });
  } catch (err) {
    console.error(`Error creating comment and linking to repository and user: ${err}`);
    res.status(500).json({ error: 'Error creating comment and linking to repository and user', details: err.message });
  }
};

// Create a comment and link it to another comment and the user who made it
export const createCommentOnComment = async (req, res) => {
  const { username, description, parentCommentDescription } = req.body;

  if (!username || !description || !parentCommentDescription) {
    return res.status(400).json({ error: 'Username, description, and parent comment description are required' });
  }

  const operation = {
    operation: `
      MATCH (u:User {username: $username})
      MATCH (p:Comment {description: $parentCommentDescription})
      CREATE (c:Comment {description: $description})
      MERGE (u)-[:MADE]->(c)
      MERGE (c)-[:COMMENTS]->(p)
      RETURN u, c, p
    `,
    parameters: { username, description, parentCommentDescription }
  };

  try {
    const result = await connectNeo4J(operation);
    const userNode = result.records[0].get('u');
    const commentNode = result.records[0].get('c');
    const parentCommentNode = result.records[0].get('p');
    res.status(200).json({ message: 'Comment created and linked to parent comment and user', user: userNode, comment: commentNode, parentComment: parentCommentNode });
  } catch (err) {
    console.error(`Error creating comment and linking to parent comment and user: ${err}`);
    res.status(500).json({ error: 'Error creating comment and linking to parent comment and user', details: err.message });
  }
};
