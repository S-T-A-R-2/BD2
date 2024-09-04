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
    files: [{
        type: mongoose.ObjectId,
        required: true
    }]
});

export default mongoose.model('Repository', repositorySchema);
