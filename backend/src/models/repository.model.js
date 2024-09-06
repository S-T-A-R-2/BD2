import mongoose from 'mongoose'

const repositorySchema = mongoose.Schema({
    owner: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim:  true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    branches: [{
        name: {
            type: String,
            required: true,
            trim: true,
        },
        files: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false
        }]
    }],
    commits: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false
    }]
});

export default mongoose.model('Repository', repositorySchema);
