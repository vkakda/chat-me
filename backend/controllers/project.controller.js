import projectModel from '../models/project.model.js';
import * as projectService from '../services/project.service.js';
import userModel from '../models/user.model.js';
import {validationResult} from 'express-validator';


export const createProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name } = req.body;
        const loggedInUser = await userModel.findOne({ email: req.user.email });
        const userId = loggedInUser._id;

        try {
            const newProject = await projectService.createProject({ name, userId });
            res.status(201).json(newProject);
        } catch (error) {
            // Handle duplicate key error from MongoDB or Mongoose custom error
            if (
                (error.code === 11000 && error.keyPattern && error.keyPattern.name) ||
                (error.name === 'MongooseError' && error.message && error.message.includes('must be unique'))
            ) {
                return res.status(400).json({ message: 'Project name already exists' });
            }
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


export const getAllProjects = async (req, res) => {
    try {
        const loggedInUser = await userModel.findOne({ 
            email: req.user.email 
        });

        

        const allUserProjects = await projectService.getAllProjectByUserId({
            userId: loggedInUser._id
        });

        res.status(200).json({projects: allUserProjects});

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}


export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { projectId, users } = req.body;

        const loggedInUser = await userModel.findOne({ email: req.user.email });
        
        const project = await projectService.addUsersToProject({
            projectId, 
            users,
            userId: loggedInUser._id
        });

        return res.status(200).json({ message: 'Users added to project successfully', project });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;

        

        const project = await projectService.getProjectById({projectId})

        return res.status(200).json({ project });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}