import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectDetails, uploadDocumentsToProject, processAllDocuments, scrapeWebsite } from '../lib/actions';
import SimpleDialog from '../components/dialog';
import { File, FileClock , FileCheck ,CloudCog , BotMessageSquare} from 'lucide-react'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import * as HoverCard from '@radix-ui/react-hover-card'
import * as Separator from '@radix-ui/react-separator'

interface ProjectDetails {
  name: string;
  project_id: string;
  description: string;
  created_at: string;
  updated_at: string;
  files: File[];
}

interface File {
  id: string;
  name: string;
  type: string;
  processed: boolean;
}

const FileExplorer: React.FC = () => {
  const { projectId } = useParams();
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [selectedFile, setSelectedFile] = useState(null)

  const handleProcessAll = async () => {
    if (projectId) {
      await processAllDocuments(projectId);
    }
  };

  const handleScrapeUrl = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const url = formData.get('url') as string;
    if (projectId) {
      await scrapeWebsite(url, projectId);
      const updatedDetails = await getProjectDetails(projectId);
      setProjectDetails(updatedDetails);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData(e.target as HTMLFormElement);
    const files = formData.getAll('documents');
    
    try {
      await uploadDocumentsToProject(projectId as string, files, (progress) => {
        setUploadProgress(progress);
      });
      // Refresh project details after successful upload
      if (projectId) {
        const updatedDetails = await getProjectDetails(projectId);
        setProjectDetails(updatedDetails);
        // Reset the file input after successful upload
        const fileInput = document.querySelector('input[name="documents"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    if (projectId) {
      getProjectDetails(projectId)
        .then(setProjectDetails)
        .catch(console.error);
    }
  }, [projectId]);

  return (
    <div>
      <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 flex justify-between">
        <div className="flex flex-col justify-start">
          <h1 className="text-2xl font-bold">{projectDetails?.name}: File Explorer</h1>
          <p className="text-sm text-left">Created at:{ new Date (projectDetails?.created_at || '').toLocaleDateString()}</p>
          <p className="text-sm text-left">Updated at: { new Date (projectDetails?.updated_at || '').toLocaleDateString()}</p>
        </div>
      <div className='flex flex-row gap-2'>
        <div className='btn btn-primary btn-sm flex flex-row gap-2 align-middle items-center bg-blue-500 rounded-md p-4 cursor-pointer' onClick={handleProcessAll}>
          <CloudCog size={32} /> Process All Documents
        </div>
        <Link to={`/chat/${projectId}`} className='btn btn-primary btn-sm flex flex-row gap-2 align-middle items-center bg-blue-500 rounded-md p-4 cursor-pointer text-white'>
          <BotMessageSquare size={32} /> Chat with Documents
        </Link>
        <SimpleDialog triggerText="Upload Files" title="Upload Files">
          <form onSubmit={handleScrapeUrl} className='flex flex-col gap-2 mb-10'>
            <input type="text" placeholder="URL" name="url" className='border border-gray-300 rounded-md p-2 text-white' />
            <button type="submit" className="btn btn-primary text-white mt-2">
              Scrape URL
            </button>
          </form>
          <form onSubmit={handleUpload}>
            <input type="file" multiple name="documents" disabled={uploading} className="btn btn-primary" />
            <button type="submit" disabled={uploading} className="btn btn-primary text-white mt-2">
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            {uploading && (
              <div>
                <progress value={uploadProgress} max="100" />
                <span>{Math.round(uploadProgress)}%</span>
              </div>
            )}
          </form>
        </SimpleDialog>
      </div>
      </header>

      <Separator.Root className="h-[1px] bg-border" />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - File grid */}
        <ScrollArea.Root className="w-2/3 border-r" type="hover">
          <ScrollArea.Viewport className="w-full h-full">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Files</h2>
              <div className="grid grid-cols-3 gap-4">
                {projectDetails?.files.map((file) => (
                  <HoverCard.Root key={file.id}>
                    <HoverCard.Trigger asChild>
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedFile === file ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                        onClick={() => setSelectedFile(file)}
                      >
                        {/* <File className="mx-auto mb-2" size={24} /> */}
                        {!file.processed ?<FileClock className="mx-auto mb-2" size={24} /> : <FileCheck className="mx-auto mb-2" size={24} />}
                        <p className="text-sm text-center truncate">{file.name}</p>
                      </div>
                    </HoverCard.Trigger>
                    <HoverCard.Portal>
                      <HoverCard.Content className="bg-popover text-popover-foreground p-4 rounded-md shadow-md">
                        <h3 className="font-semibold">{file.name}</h3>
                        <p>Type: {file.type}</p>
                        <p>Size: 1.2 MB</p>
                        <p>Modified: {new Date().toLocaleDateString()}</p>
                      </HoverCard.Content>
                    </HoverCard.Portal>
                  </HoverCard.Root>
                ))}
              </div>
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex select-none touch-none p-0.5 bg-accent transition-colors duration-[160ms] ease-out hover:bg-accent-foreground data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="flex-1 bg-accent-foreground rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>

        {/* Right panel - Preview */}
        <ScrollArea.Root className="flex-1" type="hover">
          <ScrollArea.Viewport className="w-full h-full">
            <div className="p-4">
              {selectedFile ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4">{selectedFile.name}</h2>
                  <div className="bg-muted p-4 rounded">
                    <p>Preview of {selectedFile.name}</p>
                    <p>Type: {selectedFile.type}</p>
                    {/* Add actual preview content here */}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <File size={48} />
                  <p className="mt-2">Select a file to preview</p>
                </div>
              )}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex select-none touch-none p-0.5 bg-accent transition-colors duration-[160ms] ease-out hover:bg-accent-foreground data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="flex-1 bg-accent-foreground rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>
    </div>
    </div>
  );
};

export default FileExplorer;