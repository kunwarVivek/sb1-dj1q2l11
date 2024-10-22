import React, { useState } from 'react';
import { Folder, File, Upload, Search } from 'lucide-react';

const VDR: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const documents = [
    { id: 1, name: 'Financial Statements', type: 'folder', items: 5 },
    { id: 2, name: 'Legal Documents', type: 'folder', items: 3 },
    { id: 3, name: 'Employee Contracts', type: 'folder', items: 10 },
    { id: 4, name: 'Intellectual Property', type: 'folder', items: 2 },
    { id: 5, name: 'Company Overview.pdf', type: 'file', size: '2.5 MB' },
    { id: 6, name: 'Market Analysis.pptx', type: 'file', size: '5.1 MB' },
  ];

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Virtual Data Room</h1>
      <div className="mb-6 flex space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors duration-200">
          <Upload className="w-5 h-5" />
          <span>Upload</span>
        </button>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors duration-200">
              {doc.type === 'folder' ? (
                <Folder className="w-8 h-8 text-indigo-500" />
              ) : (
                <File className="w-8 h-8 text-gray-500" />
              )}
              <div>
                <h3 className="font-semibold">{doc.name}</h3>
                <p className="text-sm text-gray-500">
                  {doc.type === 'folder' ? `${doc.items} items` : doc.size}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VDR;