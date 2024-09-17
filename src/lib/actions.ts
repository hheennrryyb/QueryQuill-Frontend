import axios from 'axios';
import axiosInstance, { setAuthToken } from './axios-instance';

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axiosInstance.post('/login/', {
        username,
        password
    });
    const { access, refresh } = response.data;
    setAuthToken(access);
    localStorage.setItem('refreshToken', refresh);
    
    if (response.status === 200) {
      return response;
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getProjects = async () => {
    try {
        const response = await axiosInstance.get(import.meta.env.VITE_BACKEND_URL+'/projects/');
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

export const queryVectorProject = async (query: string, projectId: string) => {
    try {
        const response = await axiosInstance.post(import.meta.env.VITE_BACKEND_URL+'/query/', {
            query: query,
            project_id: projectId
        });
        return response.data;
    } catch (error) {
        console.error('Error querying project:', error);
        throw error;
    }
};

export const createNewProject = async (projectName: string) => {
    try {
        const response = await axiosInstance.post(import.meta.env.VITE_BACKEND_URL+'/create_project/', {
            project_name: projectName
        });
        return response.data;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
};

export const getProjectDetails = async (projectId: string) => {
  try {
    const response = await axiosInstance.post(import.meta.env.VITE_BACKEND_URL + '/project_detail/', {
      project_id: projectId
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching project details:', error);
    throw error;
  }
};

export const uploadDocumentsToProject = async (projectId: string, documents: File[], onProgress: (progress: number) => void) => {
  try {
    const formData = new FormData();
    formData.append('project_id', projectId);
    
    documents.forEach((doc) => {
      formData.append('documents', doc);
    });
    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }
    const response = await axiosInstance.post(
      `${import.meta.env.VITE_BACKEND_URL}/upload/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const totalLength = progressEvent.lengthComputable ? progressEvent.total : parseInt(progressEvent.target.getResponseHeader('content-length'), 10);
          const progress = Math.round((progressEvent.loaded * 100) / totalLength );
          onProgress(progress);
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error response:', error.response.data);
    }
    console.error('Error uploading documents:', error);
    throw error;
  }
};

export const processAllDocuments = async (projectId: string) => {
    try {
        const response = await axiosInstance.post(import.meta.env.VITE_BACKEND_URL+'/process/', {
            project_id: projectId
        });
        return response.data;
    } catch (error) {
        console.error('Error processing documents:', error);
        throw error;
    }
};

export const scrapeWebsite = async (url: string, projectId: string) => {
    try {
        const response = await axiosInstance.post(import.meta.env.VITE_BACKEND_URL+'/scrape_url/', {
            url: url,
            project_id: projectId
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error scraping website:', error);
        throw error;
    }
}

