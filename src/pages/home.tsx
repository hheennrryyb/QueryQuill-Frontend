import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, FileText, Database, Server, Code, Lock, Brain, Cpu, Book, Upload, MessageSquare } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="h-full bg-gradient-to-br from-secondary via-secondary to-accent overflow-scroll px-4 md:px-12  ">
        <div className="flex flex-col justify-center items-center h-1/2">
            <div className="flex flex-row items-center relative mb-5 mt-20 animate-appear">
                <img src={"/LogoShape.png"} alt="Query Quill Logo" className="w-40 animate-spin-slow" />
                <span className="bg-clip-text blur-xl text-green-200 text-6xl font-bold absolute right-1/2 transform translate-x-1/2"><img src={"/Q@2x.png"} alt="Quill" className="w-12"/></span>
                <p className="bg-clip-text text-white text-5xl font-extrabold absolute right-1/2 transform translate-x-1/2 "><img src={"/Q@2x.png"} alt="Quill" className="w-12"/></p>
            </div>
            <header className="text-center mb-12 animate-fade-in">
                <h1 className="text-4xl font-bold mb-2 text-white">Query Quill</h1>
                <p className="text-xl text-gray-200">A personal project by Henry Bellman</p>
                <div className="flex flex-row justify-center gap-4 items-center relative mb-5 mt-5 animate-appear">
                    <Link to="/login" className="bg-white text-secondary px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">Get Started</Link>
                    <Link to="/demo" className="bg-white text-secondary px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">Demo</Link>
                </div>
            </header>
        </div>
      <div className="container mx-auto px-4 py-8 ">
        

        <section className="mb-12 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">About</h2>
          <p className="text-lg mb-4 text-gray-200">
            Query Quill is an innovative document processing and querying platform that empowers users to build custom-trained RAG (Retrieval-Augmented Generation) models with ease. 
            It allows users to upload documents, process them, and perform intelligent queries on the content. By leveraging advanced natural language processing techniques, 
            Query Quill enables you to create tailored AI assistants that can understand and respond to queries based on your specific documents you've uploaded. Whether you're researching, analyzing, or exploring large sets of documents, 
            Query Quill streamlines the process of building and deploying powerful, context-aware AI models without requiring deep technical expertise.
          </p>
        </section>

        <section className="mb-12 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-white">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StepItem
            icon={<Upload className="w-12 h-12" />}
            step={1}
            title="Document Ingestion"
            description="Upload document types including web pages, PDFs, and raw text. Documents are then parsed and normalized for processing."
            />
            <StepItem
            icon={<Database className="w-12 h-12" />}
            step={2}
            title="Vector Embedding"
            description="Documents undergo semantic analysis using LangChain Models. The resulting high-dimensional vector representations are indexed in a FAISS database for rapid similarity search."
            />
            <StepItem
            icon={<MessageSquare className="w-12 h-12" />}
            step={3}
            title="Semantic Querying"
            description="Utilize natural language processing to interpret user queries, retrieve relevant document segments, and generate context-aware responses through ChatGPT, RAG, and vector search."
            />
        </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-white">Technologies Used</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TechItem icon={<Code />} name="React" description="Frontend framework" />
            <TechItem icon={<Code />} name="TypeScript" description="Type-safe JavaScript" />
            <TechItem icon={<FileText />} name="Django" description="Backend framework" />
            <TechItem icon={<Database />} name="PostgreSQL" description="Relational database" />
            <TechItem icon={<Brain />} name="FAISS" description="Vector database" />
            <TechItem icon={<Cpu />} name="PyTorch" description="Machine learning" />
            <TechItem icon={<Book />} name="LangChain" description="LLM framework" />
            <TechItem icon={<Lock />} name="JWT" description="Authentication" />
            <TechItem icon={<Server />} name="Celery" description="Asynchronous tasks" />
            <TechItem icon={<Database />} name="Redis" description="Caching and message broker" />
          </ul>
        </section>

        <section className="mb-12 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">Future Features</h2>
          <p className="text-lg mb-4 text-gray-200 ">
            In future versions of Query Quill, you will be able to deploy your custom-trained chatbot directly to your website using embeds or widgets. This feature will allow you to seamlessly integrate your AI assistant into your web pages, providing an interactive and intelligent user experience. By simply copying and pasting a small snippet of code, you can embed the chatbot widget anywhere on your site, enabling visitors to interact with your custom-trained model in real-time. This will be particularly useful for customer support, information retrieval, and enhancing user engagement on your platform.
          </p>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-white">Connect With Me</h2>
          <div className="flex justify-center space-x-4">
            <SocialLink href="https://github.com/hheennrryyb" icon={<Github />} name="GitHub" />
            <SocialLink href="https://www.linkedin.com/in/henry-bellman" icon={<Linkedin />} name="LinkedIn" />
          </div>
        </section>

        <div className="text-center mt-12 mb-28">
          <Link to="/login" className="bg-white text-secondary px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
            Get Started
          </Link>
        </div>
      </div>
      <div className="text-center mt-12 mb-28">
        <Link to="/disclosure" className="text-white">Data Privacy and File Upload Disclosure</Link>
      </div>
    </div>
  );
};

const TechItem: React.FC<{ icon: React.ReactNode; name: string; description: string }> = ({ icon, name, description }) => (
  <div className="flex items-center p-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg">
    <div className="mr-4 text-white">{icon}</div>
    <div>
      <h3 className="font-semibold text-white">{name}</h3>
      <p className="text-sm text-gray-200">{description}</p>
    </div>
  </div>
);

const SocialLink: React.FC<{ href: string; icon: React.ReactNode; name: string }> = ({ href, icon, name }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center text-white hover:text-opacity-80">
    {icon}
    <span className="ml-2">{name}</span>
  </a>
);

const StepItem: React.FC<{ icon: React.ReactNode; step: number; title: string; description: string }> = ({ icon, step, title, description }) => (
  <div className="flex flex-col items-center text-center">
    <div className="text-white mb-2">{icon}</div>
    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mb-2">{step}</div>
    <h3 className="font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-200">{description}</p>
  </div>
);

export default Home;
