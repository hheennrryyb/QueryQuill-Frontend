import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, FileText, Database, Server, Code, Lock, Brain, Cpu, Book } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="h-full bg-gradient-to-br from-secondary via-secondary to-accent overflow-scroll px-12 ">
        <div className="flex flex-col justify-center items-center h-1/2">
            <div className="flex flex-row items-center relative mb-5 mt-20 animate-appear">
                <img src={"/LogoShape.png"} alt="Query Quill Logo" className="w-40 animate-spin-slow" />
                <span className="bg-clip-text blur-xl text-green-200 text-6xl font-bold absolute right-1/2 transform translate-x-1/2">Q</span>
                <p className="bg-clip-text text-white text-5xl font-extrabold absolute right-1/2 transform translate-x-1/2 ">Q</p>
            </div>
            <header className="text-center mb-12 animate-fade-in">
                <h1 className="text-4xl font-bold mb-4 text-white">Query Quill</h1>
                <p className="text-xl text-gray-200">A personal project by Henry Bellman</p>
            </header>
        </div>
      <div className="container mx-auto px-4 py-8 ">
        

        <section className="mb-12 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">About Query Quill</h2>
          <p className="text-lg mb-4 text-gray-200">
            Query Quill is an innovative document processing and querying application. It allows users to upload documents,
            process them, and perform intelligent queries on the content. Whether you're researching, analyzing, or just
            exploring large sets of documents, Query Quill makes it easy and efficient.
          </p>
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

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-white">Connect with Henry</h2>
          <div className="flex justify-center space-x-4">
            <SocialLink href="https://github.com/hheennrryyb" icon={<Github />} name="GitHub" />
            <SocialLink href="https://www.linkedin.com/in/henry-bellman" icon={<Linkedin />} name="LinkedIn" />
          </div>
        </section>

        <div className="text-center mt-12 mb-28">
          <Link to="/projects" className="bg-white text-secondary px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
            Get Started
          </Link>
        </div>
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

export default Home;
