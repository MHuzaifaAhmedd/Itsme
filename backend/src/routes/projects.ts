import { Router, Request, Response } from 'express';
import Project from '../models/Project';

const router = Router();

// GET /api/projects - Get all projects
router.get('/', async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
    });
  }
});

// GET /api/projects/featured - Get featured projects
router.get('/featured', async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(6);
    res.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured projects',
    });
  }
});

// GET /api/projects/:id - Get single project
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch project',
    });
  }
});

// POST /api/projects - Create new project (for admin use)
router.post('/', async (req: Request, res: Response) => {
  try {
    const project = new Project(req.body);
    await project.save();
    
    res.status(201).json({
      success: true,
      project,
    });
  } catch (error: any) {
    console.error('Error creating project:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map((e: any) => e.message).join(', '),
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create project',
    });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    res.json({
      success: true,
      project,
    });
  } catch (error: any) {
    console.error('Error updating project:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map((e: any) => e.message).join(', '),
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update project',
    });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project',
    });
  }
});

export default router;
