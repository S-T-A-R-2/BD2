import { connectNeo4J, connectNeo4JRead } from '../db.js';


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
    res.json({ message: 'Repository created and relationship OWNS established', user: userNode, repository: repositoryNode });
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

export const checkSubscription = async (req, res) => {
  const {username} = req.body
  const {repositoryName} = req.query;
//Valida que exista el usuario y el repositorio a suscribirse

if (!username || !repositoryName) {
  console.log(username,repositoryName);
  return res.status(400).send('Missing username or repository name to subscribe');
}

  const query = {
    operation: `
    MATCH (u:User {username: $username})-[q:subscribes]->(r:Repository {name: $repositoryName})
    RETURN EXISTS((u)-[:subscribes]->(r)) AS relation;
    `,
    parameters: {username, repositoryName}

  };
  const result = await connectNeo4J(query);
  if (result.records[0]) {
    res.status(200).json({ message: 'Subscription exists', message: "Suscrito"});
  } else {
    res.status(200).json({ message: 'Subscription exists', message: "No suscrito"});
  }
}


export const subscribe = async (req, res) => {
  const {username} = req.body
  const {repositoryName} = req.query;
  //Variable enviada al front end
  let message;
//Valida que exista el usuario y el repositorio a suscribirse
if (!username || !repositoryName) {
  console.log(username,repositoryName);
  return res.status(400).send('Missing username or repository name to subscribe');
}

  const query = {
    operation: `
    MATCH (u:User {username: $username})-[q:subscribes]->(r:Repository {name: $repositoryName})
    RETURN EXISTS((u)-[:subscribes]->(r)) AS relation;
    `,
    parameters: {username, repositoryName}

  };
  const result = await connectNeo4J(query);
  //Si ya existe la elimina
  let operation;
  if (result.records[0]) {
    operation = {
        operation: `
          MATCH (p:User {username:$username})-[s:subscribes]
          ->(r:Repository {name:$repositoryName})
          DELETE s;
          `,
           parameters: {username, repositoryName}}
    message = "No suscrito";
  } else {
    //Si no existe la crea
    operation = {
      operation: `
          MATCH (u:User {username: $username})
          MATCH (r:Repository {name: $repositoryName})
          MERGE (u)-[s:subscribes]->(r)
          RETURN u, s, r
          `
      , parameters: {username, repositoryName}}
    message = "Suscrito";
    }
  try {
      const result = await connectNeo4J(operation);
      res.status(200).json({ message: 'Subscription made', message: message});
    } catch (err) {
      console.error(`Error subscribing to the repository: ${err}`);
      res.status(500).json({ error: 'Error subscribing to the repository: ', details: err.message });
  }
    
  }

export const createTags = async (req, res) => {
  const {tags, owner, repo} = req.body;

  const operation = {
    operation: `
      MATCH (u:User {username:$owner})-[:OWNS]->(r:Repository {name:$repo})
      UNWIND $tags AS tagP
      MERGE (t: Tag {tag:tagP})
      MERGE (t)-[:CATEGORIZES]->(r)
      RETURN u,t,r
    `,
    parameters: { tags, owner, repo}
  };
  
  try {
      const result = await connectNeo4J(operation);
      res.status(200).json({ message: 'Tags made'});
    } catch (err) {
      console.error(`Error making tags: ${err}`);
      res.status(500).json({ error: 'Error making tags: ', details: err.message });
  }
 };

export const getRecommendations = async (req, res) => {
  const {username} = req.query;

  const query = {
    operation: `
      MATCH (u:User {username:$username})-[:subscribes]->(r:Repository)
      MATCH (t:Tag) -[:CATEGORIZES]-> (r)
      MATCH (t)-[:CATEGORIZES]-> (e:Repository)
      MATCH (a:User)-[:OWNS]->(e)
      WHERE e <> r
      RETURN DISTINCT a, e
      LIMIT 10;
    `,
    parameters: { username }
  };

  try {
    const result = await connectNeo4J(query);
    const recommendations = result.records.map( record => ({
      repo: record.get('e'),
      owner: record.get('a')
    }));
    res.status(200).json({ message: 'Recommendations retrieved', recommendations }); 
  } catch (err) {
      console.error(`Error getting recomendations: ${err}`);
      res.status(500).json({ error: 'Error getting recomendations: ', details: err.message });
  }
}
