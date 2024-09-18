import axios from './axios';

//const API = 'http://localhost:5000/api'

export const registerRequest = (user) => axios.post(`/register`, user);
export const createUser = (user) => axios.post('create-user', user);
export const loginRequest = (user) => axios.post(`/login`, user);
export const verifyTokenRequest = () => axios.get(`/verify`);


export const createRepository = (repository) => axios.post(`/repositories`, repository);
export const createRepoNeo = (repository) => axios.post('/create-repository', repository);
export const getRepository = (repository) => axios.get(`/repositories/:id`, {
    params: repository
  });
export const getRepositories = (repository) => axios.get(`/repositories`, {
    params: repository
  });
export const createFile = (file, repositoryId) => axios.post(`/repositories/${repositoryId}/create`, file);
export const getFiles = (repositoryId) => axios.get(`/repositories/${repositoryId.repositoryId}/create`, {
    params: repositoryId
  });
//export const getReposi

export const createBranches = (branches, repositoryId) => axios.post(`/repositories/${repositoryId}/create_branches`, branches);
export const getBranches = (repositoryId) => axios.get(`/repositories/${repositoryId}/create_branches`, {
  params: repositoryId
});
export const updateBranches = (branches, id) => axios.put(`/repositories/${id}/create_branches`, branches, {
  params: {id}
});

export const subscribe = (username, repositoryName, repositoryId) => axios.post(`/repositories/${repositoryId}`, {
  name: username, repoName: repositoryName
})