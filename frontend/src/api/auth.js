import axios from './axios';

//const API = 'http://localhost:5000/api'

export const registerRequest = (user) => axios.post(`/register`, user);
export const loginRequest = (user) => axios.post(`/login`, user);
export const verifyTokenRequest = () => axios.get(`/verify`);


export const createRepository = (repository) => axios.post(`/repositories`, repository);
export const getRepository = (repository) => axios.get(`/repositories/:id`, {
    params: repository
  });
export const getRepositories = (repository) => axios.get(`/repositories`, {
    params: repository
  });
export const createFile = (file, repositoryId) => axios.post(`/repositories/${repositoryId}/create`, file);

//export const getReposi
