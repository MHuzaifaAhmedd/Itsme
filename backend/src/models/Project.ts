import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    technologies: {
      type: [String],
      required: [true, 'At least one technology is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one technology is required',
      },
    },
    githubUrl: {
      type: String,
      trim: true,
      match: [
        /^https?:\/\/.+/,
        'Please provide a valid URL',
      ],
    },
    liveUrl: {
      type: String,
      trim: true,
      match: [
        /^https?:\/\/.+/,
        'Please provide a valid URL',
      ],
    },
    imageUrl: {
      type: String,
      trim: true,
      match: [
        /^https?:\/\/.+/,
        'Please provide a valid URL',
      ],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for faster queries
ProjectSchema.index({ featured: 1, createdAt: -1 });

export default mongoose.model<IProject>('Project', ProjectSchema);
