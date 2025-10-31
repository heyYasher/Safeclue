
import React, { useState } from 'react';
import { User, Project, Notification, Booking } from '../../types';
import type { View } from '../../types';
import Header from '../shared/Header';
import { MapPinIcon } from '../shared/icons';

interface ProjectListScreenProps {
  user: User;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onLogout: () => void;
  onNavigate: (view: View) => void;
  notifications: Notification[];
  onBack?: () => void;
}

const ProjectCard: React.FC<{ 
    project: Project; 
    onSelect: (project: Project) => void;
}> = ({ project, onSelect }) => (
    <div 
        className="bg-white rounded-lg shadow-lg overflow-hidden group flex flex-col"
    >
        <div className="relative cursor-pointer" onClick={() => onSelect(project)}>
            <img src={project.images[0]} alt={project.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-slate-800">{project.name}</h3>
            <div className="flex items-center text-sm text-slate-600 mt-1">
                <MapPinIcon className="w-4 h-4 mr-2 text-slate-400" />
                <span>{project.location}</span>
            </div>
            <p className="text-sm text-slate-500 mt-2 flex-grow">
                {project.description.substring(0, 100)}{project.description.length > 100 ? '...' : ''}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-end">
                 <button onClick={() => onSelect(project)} className="text-sm font-semibold text-brand-blue hover:underline">
                    View Details &rarr;
                </button>
            </div>
        </div>
    </div>
);


const ProjectListScreen: React.FC<ProjectListScreenProps> = ({ user, projects, onSelectProject, onLogout, onNavigate, notifications, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header user={user} onLogout={onLogout} onNavigate={onNavigate} notifications={notifications} onBack={onBack} />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Explore Projects</h2>
        <p className="text-slate-600 mb-8 max-w-3xl">Browse our portfolio of showcase projects. Click on any project to view its timeline and details, or book a site visit directly from the card.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(project => (
                <ProjectCard key={project.id} project={project} onSelect={onSelectProject} />
            ))}
        </div>
      </main>
    </div>
  );
};

export default ProjectListScreen;