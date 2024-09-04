import Repository from '../models/repository.model.js'
export const getRepositories = async (req, res) => {
    try {
        const repositories = await Repository.find();
        res.json(repositories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching repositories", error: error.message });
    }
};
export const getRepository = async (req, res) => {
    const repository = await Repository.findById(req.params.id)
    if (!repository) return res.status(404).json({message: "Repository not found"})
    res.json(repository)
};
export const createRepository = async (req, res) => {
    const {owner, name, files} = req.body
    const newRepository = new Repository({
        owner,
        name,
        files
    });
    const savedRepository = await newRepository.save();
    res.json(savedRepository);
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