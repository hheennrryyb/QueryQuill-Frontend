# Query Quill

![Query Quill Logo](https://query-quill-8pqht.ondigitalocean.app/QueryQuillLogoHorizontal.png)

Query Quill is an innovative document processing and querying platform that empowers users to build custom-trained RAG (Retrieval-Augmented Generation) models with ease. This project was developed by Henry Bellman as a personal project.

## Try It Out!

Visit the live site at [query-quill-8pqht.ondigitalocean.app](https://query-quill-8pqht.ondigitalocean.app) and try out the demo mode to experience Query Quill's capabilities firsthand!

## About

Query Quill allows users to upload documents, process them, and perform intelligent queries on the content. By leveraging advanced natural language processing techniques, Query Quill enables you to create tailored AI assistants that can understand and respond to queries based on your specific uploaded documents. Whether you're researching, analyzing, or exploring large sets of documents, Query Quill streamlines the process of building and deploying powerful, context-aware AI models without requiring deep technical expertise.

## How It Works

1. **Document Ingestion**: Upload various document types including web pages, PDFs, and raw text. Documents are then parsed and normalized for processing.

2. **Vector Embedding**: Documents undergo semantic analysis using LangChain Models. The resulting high-dimensional vector representations are indexed in a FAISS database for rapid similarity search.

3. **Semantic Querying**: Utilize natural language processing to interpret user queries, retrieve relevant document segments, and generate context-aware responses through ChatGPT, RAG, and vector search.

## Technologies Used

### Frontend
- React
- TypeScript
- Vite

### Backend
- Django
- PostgreSQL
- FAISS (Vector database)
- LangChain
- Sentence Transformers
- Celery
- Redis

## Features

- User authentication and authorization
- Document upload and processing (PDF, HTML)
- Project management
- Intelligent querying of processed documents
- Real-time chat interface with AI assistant
- Demo mode for quick exploration
- Asynchronous task processing with Celery

## Future Features

In future versions of Query Quill, users will be able to deploy their custom-trained chatbot directly to their website using embeds or widgets. This feature will allow for seamless integration of AI assistants into web pages, providing an interactive and intelligent user experience.

## Getting Started

### Frontend

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables (refer to `.env.example`)
4. Run the development server:
   ```
   npm run dev
   ```

### Backend

For detailed backend setup instructions, please refer to the [QueryQuill-Backend repository](https://github.com/hheennrryyb/QueryQuill-Backend).

1. Clone the backend repository:
   ```
   git clone https://github.com/hheennrryyb/QueryQuill-Backend.git
   cd QueryQuill-Backend
   ```
2. Follow the comprehensive setup instructions in the backend README, including:
   - Setting up PostgreSQL
   - Creating a virtual environment
   - Installing dependencies
   - Configuring environment variables
   - Running migrations
   - Starting the Django development server and Celery worker

## API Endpoints

- Upload documents: POST to `/upload/`
- Process documents: POST to `/process/`
- Query documents: POST to `/query/`

Note: Authentication is required for these endpoints.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your chosen license here]

## Contact

- GitHub: [https://github.com/hheennrryyb](https://github.com/hheennrryyb)
- LinkedIn: [https://www.linkedin.com/in/henry-bellman](https://www.linkedin.com/in/henry-bellman)

For any questions or concerns, please contact: henrybellman@gmail.com

## References

- [QueryQuill-Backend Repository](https://github.com/hheennrryyb/QueryQuill-Backend)