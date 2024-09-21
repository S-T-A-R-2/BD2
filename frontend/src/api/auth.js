import axios from './axios';

//const API = 'http://localhost:5000/api'

export const getRecommendations = (username) => axios.get('/get-reco',{ params: username });

export const getLiked = (req) => axios.get('/get-liked', {params: req});
export const getDisliked = (req) => axios.get('/get-disiked',{params: req});
export const makeLike = (req) => axios.post('/make-like', req);
export const unmakeLike = (req) => axios.post('/unmake-like', req);
export const makeDislike = (req) => axios.post('/make-dislike', req);
export const unmakeDislike = (req) => axios.post('/unmake-dislike', req);
export const getVotes = (req) => axios.get('/get-votes', {params: req}); 

export const createTagsNeo = (repo) => axios.post('/create-tag', repo);

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

export const subscribe = (username, repositoryName, repositoryId) => axios.post(`/repository/${repositoryId}`,{username}, {
  params: {repositoryName}
})

export const checkSubscription = (username, repositoryName, repositoryId) => axios.put(`/repository/${repositoryId}`,{username}, {
  params: {repositoryName}
})

/* commits */
export const createCommits = (commits, repositoryId) => axios.post(`/repositories/${repositoryId}/commits`, commits);
export const updateCommits = (commits, repositoryId, commitsId) => axios.put(`/repositories/${repositoryId}/commits`, commits, {
  params: {commitsId}
});
export const getCommits = (id, repositoryId) => axios.get(`/repositories/${repositoryId}/commits`, {
  params: {id}
});
