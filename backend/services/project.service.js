import projectModel from '../models/project.model.js';
import mongoose from 'mongoose';


export const createProject = async ({
    name, userId
}) => {
    if (!name || !userId) {
        throw new Error('Project name and userId are required');
    } 

    let project;
    try {
        project = await projectModel.create({
            name,
            users: [userId]
        });
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Project name already exists');
        }
        throw error;
    }

    return project;
}

export const getAllProjectByUserId = async ({userId}) => {
    if (!userId) {
        throw new Error('userId is required');
    } 

    const allUserProjects = await projectModel.find({ 
        users: userId 
    })

    return allUserProjects;
}


export const addUsersToProject = async ({projectId, users, userId}) => {
    
    if(!projectId) {
        throw new Error('Project ID is required');
    }
    if(!users) {
        throw new Error('Users array is required');
    }
    function isValidObjectId(id) {
        return mongoose.Types.ObjectId.isValid(id);
    }
    // Example usage in a function (replace with actual function where projectId and users are used)
    if (!isValidObjectId(projectId)) {
        throw new Error('Invalid projectId: not a valid Mongoose ObjectId');
    }
    if (!Array.isArray(users) || !users.every(isValidObjectId)) {
        throw new Error('Invalid users array: all elements must be valid Mongoose ObjectIds');
    }

    if (!isValidObjectId(userId)) {
        throw new Error('Invalid userId: not a valid Mongoose ObjectId');
    }

    const project = await projectModel.findById({
        _id: projectId,
        users: userId
    });

    if (!project) {
        throw new Error('Project not found- doesnt belong to project or user does not have permission to add users');
    }

    const updatedProject = await projectModel.findByIdAndUpdate({
        _id: projectId
    }, {
        $addToSet: { 
            users: { 
                $each: users 
            } 
        }
    }, { new: true
    })

    return updatedProject;

}


export const getProjectById = async ({ projectId }) => {
    if (!projectId) {
        throw new Error('Project ID is required');
    }
    

    function isValidObjectId(id) {
        return mongoose.Types.ObjectId.isValid(id);
    }

    if (!isValidObjectId(projectId)) {
        throw new Error('Invalid projectId: not a valid Mongoose ObjectId');
    }
   
    const project = await projectModel.findOne({
        _id: projectId
    }).populate('users');

    if (!project) {
        throw new Error('Project not found or you do not have access');
    }

    return project;
}