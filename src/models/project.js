import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    slug: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    image: {
        type: String,
        trim: true,
        required: true,
    },
    imageId: {
        type: String,
        trim: true,
        required: true,
    },
    category: {
        type: String,
        trim: true,
        required: true,
    },
    siteLink: {
        type: String,
        trim: true,
        required: true,
    },
    repository: {
        type: String,
        trim: true,
    },
    tags: {
        type: [String],
        trim: true,
        default: []
    },
    skills: {
        type: [String],
        trim: true,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
