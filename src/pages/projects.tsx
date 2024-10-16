import React, { useState, useEffect, useRef } from 'react';
import { getProjects, createNewProject } from '../lib/actions';
import SimpleDialog from '../components/dialog';
import { Link } from 'react-router-dom';
import { LibraryBig } from 'lucide-react';
import toast from 'react-hot-toast';
import { MessageSquare, FolderOpen } from 'lucide-react';
import LoadingSpinner from '../components/loading-spinner';

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
        <div className='p-4 rounded-xl shadow-md bg-white flex flex-col h-full'>
            <Link to={`/file-explorer/${project.id}`}  className='flex flex-row gap-2 items-center mb-2'>
                <LibraryBig size={32}/>
                <h1 className='text-2xl font-bold'>{project.name}</h1>
            </Link>
            <p className='text-gray-700 flex-grow'>{project.description}</p>
            <div className='mt-2'>
                <p className='text-sm'>Created: {new Date(project.created_at).toLocaleString()}</p>
                <p className='text-sm'>Updated: {new Date(project.updated_at).toLocaleString()}</p>
            </div>
            <div className='flex gap-2 mt-4 justify-start w-full flex-wrap'>
                <Link to={`/chat/${project.id}`} className='btn btn-outline flex items-center w-full'>
                    <MessageSquare size={16} className="mr-2" />
                    Chat
                </Link>
                <Link to={`/file-explorer/${project.id}`} className='btn btn-secondary flex items-center w-full'>
                    <FolderOpen size={16} className="mr-2" />
                    File Explorer
                </Link>
            </div>
        </div>
    );
};

const Projects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
                setTimeout(() => setIsLoading(false), 2000);
            })
            .catch((err) => {
                toast.error('Failed to fetch projects: ' + err.message);
                setTimeout(() => setIsLoading(false), 2000);
            });
    }, []);

    return (
        <div className='h-full flex flex-col'>
            <header className="bg-primary text-primary-foreground px-8 py-4 flex justify-between gap-4 flex-col md:flex-row">
                <div className="">
                    <h1 className="text-2xl font-bold">Projects</h1>
                </div>
                <SimpleDialog triggerText="Create New Project" title="Create New Project" className='btn btn-outline'>
                    <form onSubmit={handleCreateNewProjectSubmit} ref={formRef} className='flex flex-col gap-2'>
                        <input
                            type="text"
                            placeholder="Project Name"
                            ref={projectNameRef}
                            required
                            className='border border-gray-300 rounded-md p-2 text-black bg-white'
                            maxLength={30}
                        />
                        <button type="submit" className='btn btn-secondary rounded-md p-2'>Create</button>
                    </form>
                </SimpleDialog>
            </header>
            {projects.length > 0 ? (
                <div className='flex-1 overflow-auto'>
                    <div className='p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr pb-[260px] md:pb-[100px]'>
                        {projects.map((project) => (
                            <ProjectComponent key={project.id} project={project} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className='flex items-center justify-center h-full'>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <p className='text-2xl font-bold flex flex-row gap-2 items-center'>
                            <LibraryBig size={32}/> No projects found
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Projects;