import React, { useState, useEffect, useRef } from 'react';
import { getProjects, createNewProject } from '../lib/actions';
import SimpleDialog from '../components/dialog';
import { Link } from 'react-router-dom';
import { LibraryBig } from 'lucide-react';
import toast from 'react-hot-toast';
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
        <div className='p-4 rounded-lg shadow-md outline outline-2 outline-secondary'>
            <div className='flex flex-row gap-2'><LibraryBig size={32}/> <h1 className='text-2xl font-bold'>{project.name}</h1></div>
            <p className='text-gray-700'>{project.description}</p>
            <p>Created at: {new Date(project.created_at).toLocaleString()}</p>
            <p>Updated at: {new Date(project.updated_at).toLocaleString()}</p>
            <div className='flex gap-2 mt-2 justify-start'>
                <Link to={`/chat/${project.id}`} className='btn btn-primary'>Chat</Link>
                <Link to={`/file-explorer/${project.id}`} className='btn btn-secondary'>File Explorer</Link>
            </div>
        </div>
    );
};

const Projects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    const projectNameRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleCreateNewProjectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const projectName = projectNameRef.current?.value;
        if (!projectName) return;

        try {
            const newProject = await createNewProject(projectName);
            if (newProject.status >= 400) {
                throw new Error(newProject.data?.response?.data?.error || 'Failed to create project');
            }
            setProjects(prevProjects => [...prevProjects, newProject.project]);
            formRef.current?.reset();
            toast.success('Project created successfully');
        } catch (error: any) {
            toast.error(`Failed to create project: ${error.response?.data?.error || error.message || 'Unexpected error'}`);
        }
    };

    useEffect(() => {
        getProjects()
            .then((fetchedProjects) => {
                setProjects(fetchedProjects.projects);
            })
            .catch((err) => {
                toast.error('Failed to fetch projects: ' + err.message);
            });
    }, []);

    return (
        <div>
            <header className="bg-primary text-primary-foreground px-8 py-4 flex justify-between">
                <div className="flex flex-col justify-start">
                    <h1 className="text-2xl font-bold">Projects</h1>
                </div>
                <SimpleDialog triggerText="Create New Project" title="Create New Project">
                    <form onSubmit={handleCreateNewProjectSubmit} ref={formRef} className='flex flex-col gap-2'>
                        <input
                            type="text"
                            placeholder="Project Name"
                            ref={projectNameRef}
                            required
                            className='border border-gray-300 rounded-md p-2 text-white'
                            maxLength={30}
                        />
                        <button type="submit" className='btn btn-primary text-white rounded-md p-2'>Create</button>
                    </form>
                </SimpleDialog>
            </header>
            {projects.length > 0 ? (
                <div className='p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {projects.map((project) => (
                        <ProjectComponent key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <div>
                    <p className='text-2xl font-bold flex flex-row gap-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'><LibraryBig size={32}/> No projects found</p>
                </div>
            )}
            
        </div>
    );
};

export default Projects;