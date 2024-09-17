import { connectNeo4J } from '../db.js'

export const createAccount = async (username) => {
  const operation = {
    operation: `
      CREATE (a:Account {username: $username})
      RETURN a
    `,
    parameters: { username }
  };

  console.log("entra redis crear usuario");

  try {
    const result = await connectNeo4J(operation);
    return result;
  } catch (err) {
    console.error(`Error creating account: ${err}`);
    throw err;
  }
};

