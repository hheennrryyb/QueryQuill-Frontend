import React, { useState, useEffect, useRef } from 'react';
import { getProjects, createNewProject } from '../lib/actions';
import { useProfile } from '../contexts/profile-context';
import SimpleDialog from '../components/dialog';
import { Link } from 'react-router-dom';
interface Project {
    // Define project properties here, e.g.:
    id: string;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
}

const ProjectComponent = ({ project }: { project: Project }) => {
    return (
        <div className='bg-white p-4 rounded-lg shadow-md'>
            <h1 className='text-2xl font-bold'>{project.name}</h1>
            <p className='text-gray-700'>{project.description}</p>
            <p>{new Date(project.created_at).toLocaleDateString()}</p>
            <p>{new Date(project.updated_at).toLocaleDateString()}</p>
            <div className='flex gap-2 mt-2 justify-center'>
                <Link to={`/chat/${project.id}`} className='bg-blue-500 text-white rounded-md p-2'>Chat</Link>
                <Link to={`/file-explorer/${project.id}`} className='bg-blue-500 text-white rounded-md p-2'>File Explorer</Link>
            </div>
        </div>
    );
};

const Projects: React.FC = () => {
    const { profile } = useProfile();
    const [projects, setProjects] = useState<Project[]>([]);
    const [error, setError] = useState<string | null>(null);

    const projectNameRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleCreateNewProjectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const projectName = projectNameRef.current?.value;
        if (!projectName) return;

        try {
            const newProject = await createNewProject(projectName);
            setProjects(prevProjects => [...prevProjects, newProject.project]);
            formRef.current?.reset();
        } catch (error) {
            setError('Failed to create project: ' + (error as Error).message);
        }
    };

    useEffect(() => {
        getProjects()
            .then((fetchedProjects) => {
                setProjects(fetchedProjects.projects);
            })
            .catch((err) => {
                setError('Failed to fetch projects: ' + err.message);
            });
    }, []);

    return (
        <div>
            <h1>Projects</h1>
            <SimpleDialog triggerText="Create New Project" title="Create New Project">
                <form onSubmit={handleCreateNewProjectSubmit} ref={formRef} className='flex flex-col gap-2'>
                    <input 
                        type="text" 
                        placeholder="Project Name" 
                        ref={projectNameRef}
                        required
                        className='border border-gray-300 rounded-md p-2 text-white'
                    />
                    <button type="submit" className='bg-blue-500 text-white rounded-md p-2'>Create</button>
                </form>
            </SimpleDialog>
            {error ? (
                <p>Error: {error}</p>
            ) : projects.length > 0 ? (
                projects.map((project) => (
                    <ProjectComponent key={project.id} project={project} />
                ))
            ) : (
                <p>No projects found.</p>
            )}
        </div>
    );
};

export default Projects;