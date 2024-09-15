import Repository from '../models/repository.model.js'
import PrivateRepository from '../models/privateRepository.model.js'

export const getRepositories = async (req, res) => {
    try {
        const {name} = req.query;
        const repositories = await Repository.find({name: name});
        res.json(repositories);
        console.log(repositories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching repositories", error: error.message });
    }
};
export const getRepository = async (req, res) => {
    try {
        const {owner, name} = req.query;
        const repositories = await Repository.find({owner: owner, name: name});
        res.json(repositories);
        console.log(repositories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching repositories", error: error.message });
    }
};
export const createRepository = async (req, res) => {
    const {owner, name, description, branches, commits, isPrivate, tags} = req.body

    if (isPrivate) {
        const newRepository = new PrivateRepository({
            owner,
            name,
            description,
            branches,
            commits,
            tags
        });
        const savedRepository = await newRepository.save();
        res.json(savedRepository);
    } else {
        const newRepository = new Repository({
            owner,
            name,
            description,
            branches,
            commits,
            tags
        });
        const savedRepository = await newRepository.save();
        res.json(savedRepository);
    }
    
};
export const updateRepository = async (req, res) => {
    const repository = await Repository.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
    if (!repository) return res.status(404).json({message: "Repository not found"})
    res.json(repository);
};
export const deleteRepository = async (req, res) => {
    const repository = await Repository.findByIdAndDelete(req.params.id)
    if (!repository) return res.status(404).json({message: "Repository not found"})
    res.json(repository);
};
