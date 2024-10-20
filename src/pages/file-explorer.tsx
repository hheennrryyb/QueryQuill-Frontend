import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useWindowWidth } from "@react-hook/window-size";
import { getProjectDetails, uploadDocumentsToProject, processAllDocuments, scrapeWebsite, getDocumentPreview, deleteDocument, uploadTextDocument, getTaskStatus, deleteProject } from '../lib/actions';
import SimpleDialog from '../components/dialog';
import { FileIcon, FileClock, FileCheck, CloudCog, BotMessageSquare, Loader, Trash, ChevronDown, Minimize2 } from 'lucide-react'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import * as HoverCard from '@radix-ui/react-hover-card'
import * as Separator from '@radix-ui/react-separator'
import * as Collapsible from '@radix-ui/react-collapsible'
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/loading-spinner';
import { useNavigate } from 'react-router-dom';

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
  file_size: number; 
  uploaded_at: string;
}

const MAX_FILES = 10;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES = ['application/pdf', 'text/html', 'text/plain'];

const FileExplorer: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewContent, setPreviewContent] = useState(null)

  const [processingTaskId, setProcessingTaskId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 768; // Adjust this breakpoint as needed

  const [isFileLimitReached, setIsFileLimitReached] = useState(false);

  useEffect(() => {
    if (projectDetails) {
      setIsFileLimitReached(projectDetails.files.length >= MAX_FILES);
    }
  }, [projectDetails]);

  const handleProcessAll = async () => {
    if (projectId) {
      try {
        const response = await processAllDocuments(projectId);
        setProcessingTaskId(response.task_id);
        toast.success('Started processing all documents');
        getTaskStatus(response.task_id).then((status) => {
          setProcessingStatus(status.status);
        });
      } catch (error) {
        toast.error('Error starting document processing');
      }
    }
  };

  const handleDeleteProject = async () => {
    if (projectId) {
      try {
        await deleteProject(projectId);
        toast.success('Project deleted successfully');
        navigate('/projects');
      } catch (error) {
        toast.error('Error deleting project');
      }
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (processingTaskId) {
      intervalId = setInterval(async () => {
        try {
          const statusResponse = await getTaskStatus(processingTaskId);
          setProcessingStatus(statusResponse.status);

          if (statusResponse.status === 'SUCCESS') {
            clearInterval(intervalId);
            toast.success('All documents processed successfully');
            if (projectId) {
              getProjectDetails(projectId).then(setProjectDetails);
            }
          } else if (statusResponse.status === 'FAILURE') {
            clearInterval(intervalId);
            toast.error('Error processing documents');
          }
        } catch (error) {
          console.error('Error checking task status:', error);
          clearInterval(intervalId);
        }
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [processingTaskId, projectId]);

  const handleScrapeUrl = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFileLimitReached) {
      toast.error(`File limit of ${MAX_FILES} has been reached. Please delete some files before scraping more.`);
      return;
    }
    const formData = new FormData(e.target as HTMLFormElement);
    const url = formData.get('url') as string;
    if (projectId) {
      toast.promise(scrapeWebsite(url, projectId), {
        loading: 'Scraping website...',
        success: (response) => {
          toast.success(response.message);
          getProjectDetails(projectId).then(setProjectDetails);
          return 'Website scraped';
        },
        error: (error) => {
          toast.error(error.message);
          return 'Error scraping website';
        }
      });
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFileLimitReached) {
      toast.error(`File limit of ${MAX_FILES} has been reached. Please delete some files before uploading more.`);
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData(e.target as HTMLFormElement);
    const fileList = formData.getAll('documents');
    
    // Filter out non-File entries and apply size and type checks
    const domFiles = fileList.filter((item): item is globalThis.File => {
      if (!(item instanceof File)) return false;
      
      if (item.size > MAX_FILE_SIZE) {
        toast.error(`File ${item.name} is too large. Maximum size is 20MB.`);
        return false;
      }
      
      if (!ALLOWED_TYPES.includes(item.type)) {
        toast.error(`File ${item.name} is not an allowed type. Allowed types are PDF, HTML, and TXT.`);
        return false;
      }
      
      return true;
    });

    if (domFiles.length === 0) {
      setUploading(false);
      return;
    }
    
    try {
      await uploadDocumentsToProject(projectId as string, domFiles, (progress) => {
        setUploadProgress(progress);
      }).then((response) => {
        toast.success(response.message);
      }).catch((error) => {
        toast.error(error.message);
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

  const handleUploadText = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFileLimitReached) {
      toast.error(`File limit of ${MAX_FILES} has been reached. Please delete some files before adding more text documents.`);
      return;
    }
    const formData = new FormData(e.target as HTMLFormElement);
    const documentName = formData.get('documentName') as string;
    const documentContent = formData.get('documentContent') as string;
    if (projectId) {
      toast.promise(uploadTextDocument(projectId, documentName, documentContent), {
        loading: 'Uploading text document...',
        success: (response) => {
          toast.success(response.message);
          getProjectDetails(projectId).then(setProjectDetails);
          return 'Text document uploaded';
        },
        error: (error) => {
          toast.error(error.message);
          return 'Error uploading text document';
        }
      });
    }
  };

  const handlePreview = async () => {
    if (selectedFile) {
      const preview = await getDocumentPreview(selectedFile.id, projectId as string);
      setPreviewContent(preview);
    }
  };

  const handleDelete = async () => {
    if (selectedFile && projectId) {
      await deleteDocument(selectedFile.id, projectId as string);
      setSelectedFile(null);
      setPreviewContent(null);
      const updatedDetails = await getProjectDetails(projectId);
      setProjectDetails(updatedDetails);
      setIsFileLimitReached(updatedDetails.files.length >= MAX_FILES);
      toast.success('Document deleted');
    }
  };

  useEffect(() => {
    if (selectedFile) {
      handlePreview();
    }
  }, [selectedFile]);

  useEffect(() => {
    if (projectId) {
      getProjectDetails(projectId)
        .then(setProjectDetails)
        .catch(console.error);
    }
  }, [projectId]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (isMobile) {
      setIsPreviewOpen(true);
    }
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setSelectedFile(null);
  };

  return (
    <div className='flex flex-col h-full'>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-primary text-primary-foreground p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-2">
            <div className="flex flex-col justify-start md:max-w-96 pr-4">
              <h1 className="text-2xl font-bold h-8">{projectDetails?.name}</h1>
              <p className="text-sm h-5">Created: {new Date(projectDetails?.created_at || '').toLocaleDateString()}</p>
              <p className="text-sm h-5">Updated: {new Date(projectDetails?.updated_at || '').toLocaleDateString()}</p>
            </div>
            <div className='flex flex-col md:flex-row gap-2 w-full md:w-auto'>
              <SimpleDialog 
                triggerText="1. Upload Files" 
                title="Upload Files" 
                className='btn btn-outline'
              >
                <div className='bg-gray-100 p-4 rounded-lg'>
                  {isFileLimitReached ? (
                    <div className="text-red-500 mb-4">
                      File limit of {MAX_FILES} has been reached. Please delete some files before uploading more.
                    </div>
                  ) : (
                    <>
                      <h3 className='text-black mb-2'>Website URL</h3>
                      <form onSubmit={handleScrapeUrl} className='flex flex-col gap-2 mb-8'>
                        <input type="text" placeholder="URL" name="url" className='bg-white text-black border border-gray-300 rounded-md p-2' />
                        <button type="submit" className="bg-white text-black border border-gray-300 rounded-md p-2 hover:bg-gray-100">
                          Scrape URL
                        </button>
                      </form>
                      <div className='text-black mb-2'>Local Files (PDF, HTML, TXT, etc.)</div>
                      <form onSubmit={handleUpload} className='flex flex-col gap-2 mb-8'>
                        <input type="file" multiple name="documents" disabled={uploading} className="bg-white text-black border border-gray-300 rounded-md p-2" />
                        <button type="submit" disabled={uploading} className="bg-white text-black border border-gray-300 rounded-md p-2 hover:bg-gray-100">
                          {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                        {uploading && (
                          <div>
                            <progress value={uploadProgress} max="100" className="w-full" />
                            <span className="text-black">{Math.round(uploadProgress)}%</span>
                          </div>
                        )}
                      </form>
                      <div className='text-black mb-2'>Paste Text</div>
                      <form onSubmit={handleUploadText} className='flex flex-col gap-2 mb-8'>
                        <input type="text" placeholder="Document Name" name="documentName" className='bg-white text-black border border-gray-300 rounded-md p-2' />
                        <textarea placeholder="Document Content" name="documentContent" className='bg-white text-black border border-gray-300 rounded-md p-2 h-40' />
                        <button type="submit" className="bg-white text-black border border-gray-300 rounded-md p-2 hover:bg-gray-100">
                          Upload Text
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </SimpleDialog>
              <button 
                className='btn btn-outline' 
                onClick={handleProcessAll} 
                disabled={!!processingTaskId}
              >
                <CloudCog size={24} />
                <span className="hidden md:inline">2. Process All Documents</span>
                <span className="md:hidden">2. Process All</span>
                {processingTaskId && processingStatus !== 'SUCCESS' && processingStatus !== 'FAILURE' && (
                  <Loader size={16} className='animate-spin'/>
                )}
              </button>
              <Link 
                to={`/chat/${projectId}`} 
                className='btn btn-outline'
              >
                <BotMessageSquare size={24} />
                <span className="hidden md:inline">3. Chat with Documents</span>
                <span className="md:hidden">3. Chat</span>
              </Link>
            </div>
          </div>
          <Collapsible.Root className="mt-4">
            <Collapsible.Trigger className="flex flex-row items-center text-sm text-black border border-black rounded-[40px] py-2 px-4 bg-white">
              <ChevronDown size={16} />
              <span>Project Actions</span>
            </Collapsible.Trigger>
            <Collapsible.Content
              className='flex flex-row gap-2'
            >
              <SimpleDialog 
                triggerText="Delete Project" 
                title="Delete Project" 
                className='bg-red-500 border text-sm border-white text-center w-full md:w-fit mt-2 py-2 px-4'
              >
                <div className='flex flex-row gap-2 align-middle items-center'>
                  Are you sure you want to delete this project? This action cannot be undone.
                  <button 
                    className='btn btn-primary flex flex-row gap-2 align-middle items-center rounded-md p-4 cursor-pointer bg-red-500' 
                    onClick={handleDeleteProject}
                  >
                    <Trash size={16} className='text-white' />
                  </button>
                </div>
              </SimpleDialog>
              <SimpleDialog
                triggerText="Help Me" 
                title="How to use QueryQuill" 
                className='bg-white border text-sm border-black text-center w-full md:w-fit mt-2 py-2 px-4'
              >
                <div className=''>
                  <p className="mt-2">📤 1. Upload your documents or web pages to begin.</p>
                  <p className="mt-2">⚙️ 2. Click "Process All" to prepare your content for intelligent chat. You must process all documents before you can chat with them. Any new files uploaded after processing has started will not be included in the chat-ready version.</p>
                  <p className="mt-2">💬 3. Head to the Chat section to start asking questions about your documents!</p>
                  <p className="mt-2">👀 4. Click on a document to preview and delete it.</p>

                  <p className="mt-2">⏳ Note: Processing can take a while for large documents or web pages. Please be patient.</p>
                </div>
              </SimpleDialog>
            </Collapsible.Content>
          </Collapsible.Root>
        </header>

        <Separator.Root className="h-[1px] bg-border" />

        {/* Main content */}
        <PanelGroup direction={isMobile ? "vertical" : "horizontal"} className="flex-1">
          <Panel defaultSize={100} minSize={20}>
            <ScrollArea.Root className="w-full h-full" type="hover">
              <ScrollArea.Viewport className="w-full h-full">
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-4">Files</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {projectDetails?.files.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground col-span-full">
                        <FileIcon size={48} />
                        <p className="mt-2">No files uploaded yet.</p>
                        <div className="mt-4 text-sm bg-muted p-4 rounded-md">
                          <p className="mt-2">1. Upload some files to get started.</p>
                          <p className="mt-2">2. Process all documents to create a chat-ready version.</p>
                          <p className="mt-2">3. Chat with your documents.</p>
                        </div>
                      </div>
                    ) : (
                      projectDetails?.files.map((file) => (
                        <HoverCard.Root key={file.id}>
                        <HoverCard.Trigger asChild>
                          <div
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedFile === file ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'
                            }`}
                            onClick={() => handleFileSelect(file)}
                          >
                            {!file.processed ? <FileClock className="mx-auto mb-2" size={24} /> : <FileCheck className="mx-auto mb-2" size={24} />}
                            <p className="text-sm text-center truncate">{file.name.split('/').pop()}</p>
                          </div>
                        </HoverCard.Trigger>
                        <HoverCard.Portal>
                          <HoverCard.Content className="bg-popover text-popover-foreground p-4 rounded-md shadow-md">
                            <h3 className="font-semibold">{file.name.split('/').pop()}</h3>
                            <p>Size: {(file.file_size / 1000).toFixed(2)} kB</p>
                            <p>Uploaded: {new Date(file.uploaded_at).toLocaleString()}</p>
                          </HoverCard.Content>
                        </HoverCard.Portal>
                      </HoverCard.Root>
                    )))}
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
          </Panel>

          {!isMobile && <PanelResizeHandle className="w-2 bg-border hover:bg-accent cursor-col-resize" />}

          {(!isMobile || isPreviewOpen) && (
            <Panel minSize={40} className={isMobile ? 'fixed inset-0 z-50 bg-background' : ''}>
              <ScrollArea.Root className="w-full h-full" type="hover">
                <ScrollArea.Viewport className="w-full h-full">
                  <div className="p-4">
                    {selectedFile ? (
                      <div>
                        {isMobile && (
                          <button onClick={closePreview} className="mb-4">
                            <Minimize2 size={24} className='text-white' />
                          </button>
                        )}
                        <h2 className="text-xl font-semibold mb-4 break-all">{selectedFile.name}</h2>
                        <button onClick={handleDelete} className="btn btn-outline text-white bg-red-500">Delete Document</button>
                        <div className="bg-muted p-4 rounded">
                          <p className='text-lg font-semibold break-all'>Preview of {selectedFile.name.split('/').pop()}</p>
                          <div className="my-4 border-t border-accent"></div>
                          {previewContent ?
                          <div>
                            <p>{previewContent}</p>
                            <p className='text-xs text-muted-foreground mt-4'>First 50000 characters or max 10 pages</p>
                          </div>
                          :<p><LoadingSpinner /></p>}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground pt-[44px]">
                        <FileIcon size={48} />
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
            </Panel>
          )}
        </PanelGroup>
      </div>
    </div>
  );
};

export default FileExplorer;
