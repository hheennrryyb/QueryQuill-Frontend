import React from 'react';
import { Link } from 'react-router-dom';

const Disclosure: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 h-full overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Data Privacy and File Upload Disclosure</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">File Uploads</h2>
        <p className="mb-4">
          Query Quill allows users to upload various types of documents, including PDFs, web pages, and raw text. These files are processed and stored securely to provide our services.
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Uploaded files are used solely for the purpose of creating and maintaining your personal knowledge base.</li>
          <li>We do not share your uploaded files with any third parties.</li>
          <li>Files are stored securely and are only accessible to you within your projects.</li>
          <li>Files, vector databases, and projects are subject to deletion or modification as part of our service operations or at your request.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">User Information</h2>
        <p className="mb-4">
          To provide our services, we collect and store certain user information:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Username</li>
          <li>Email address (optional)</li>
          <li>Encrypted password</li>
        </ul>
        <p>
          This information is used for account management, authentication, and to provide personalized services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Privacy</h2>
        <p className="mb-4">
          At Query Quill, we take your privacy seriously. Here's how we protect your data:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>All data transmissions are encrypted using industry-standard protocols.</li>
          <li>User passwords are hashed and salted before storage.</li>
          <li>We do not sell or share your personal information or uploaded content with third parties.</li>
          <li>You have the right to request deletion of your account and associated data at any time.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Usage</h2>
        <p className="mb-4">
          The data you provide and upload is used to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Create and maintain your personal knowledge base</li>
          <li>Process and analyze your documents to provide search and query capabilities</li>
          <li>Improve our services and user experience</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Content Responsibility</h2>
        <p className="mb-4">
          While we strive to maintain a safe and lawful environment, please note:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Query Quill is not responsible for any illegal, explicit, or potentially damaging content uploaded to our platform by users.</li>
          <li>Users are solely responsible for ensuring that the content they upload complies with all applicable laws and regulations.</li>
          <li>We reserve the right to remove any content that violates our terms of service or is reported as inappropriate.</li>
        </ul>
      </section>

      <p className="mb-4">
        By using Query Quill, you agree to our data handling practices as described above. If you have any questions or concerns, please contact us.
      </p>

      <div className="mt-8 mb-8">
        Contact Query Quill for any questions or concerns: <a href="mailto:henrybellman@gmail.com">henrybellman@gmail.com</a>
      </div>

      <Link to="/" className="text-blue-500 hover:text-blue-700">
        Back to Home
      </Link>
    </div>
  );
};

export default Disclosure;