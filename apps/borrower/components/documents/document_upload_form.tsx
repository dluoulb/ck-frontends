import React, { useState } from 'react';
import classNames from 'classnames';
import FileUploader from './file_uploader';
import { ListBox } from '@components/Dropdown';
import { ListboxOption } from '@headlessui/react';
import useToast from '@hooks/useToast';
import { uploadCompanyDocument } from '@lib/actions/companies'
import { uploadConsumerDocument } from '@lib/actions/accounts';
import useApi from '@hooks/useApi';
import { useEntity } from '@contexts/EntityContext';



export default function DocumentUploadForm() {
    const { entity } = useEntity();
    const api = useApi();
    const { makeToast } = useToast();

    const documentTypes = [
        { id: 'bank_statements', name: 'Bank Statement' },
        { id: 'invoice', name: 'Invoice' },
        { id: 'id_proof', name: 'ID Proof' },
        { id: 'tax_document', name: 'Tax Document' },
        ];

    const [selectedType, setSelectedType] = useState(documentTypes[0]);
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);


    const handleUpload = async () => {
      if (!file || !entity?.id) return;

      setIsUploading(true);

      try {
        if (entity.type === 'company') {
          await uploadCompanyDocument(api, entity.id, file, selectedType.id, description);
        } else {
          await uploadConsumerDocument(api, entity.id, file, selectedType.id, description);
        }
        
        setFile(null);
        setDescription('');
        setSelectedType(documentTypes[0]);
        makeToast('File uploaded', 'success');
      } catch (err) {
        makeToast('An error occured. Please contact our support team (support@creditkey.com)', 'error');
      } finally {
        setIsUploading(false);
      }
    };
    
    return (
      <div className="relative rounded-md border-t border-x border-primary-gray-border shadow-sm mt-4 md:mt-8 min-h-max">
        <div className="py-8 px-6 border-b border-primary-gray-border">
          <p className="text-2xl font-bold text-primary">
            Upload Document
          </p>
        </div>
        <div className="border-b border-gray-200 -mb-px flex w-full">
          <div className="p-6 w-full">
              {/* Dropzone Area */}
              <FileUploader selectedFile={file} onFileSelect={setFile}/>

              {/* Document Type & Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                      Document Type
                  </label>
                  <ListBox
                      value={selectedType}
                      handleChange={setSelectedType}
                      buttonText={selectedType.name}
                      listBoxClass="border border-gray-300 rounded-md shadow-sm text-sm w-full"
                      >
                      {documentTypes.map((doc) => (
                          <ListboxOption
                          key={doc.id}
                          value={doc}
                          className={({ active }) =>
                              classNames(
                              'cursor-pointer select-none py-2 px-4 text-sm',
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              )
                          }
                          >
                          {({ selected: isSelected }) => (
                              <span
                              className={classNames(
                                  'block truncate text-sm',
                                  isSelected ? 'font-semibold text-gray-900' : 'text-gray-700'
                              )}
                              >
                              {doc.name}
                              </span>
                          )}
                          </ListboxOption>
                      ))}
                  </ListBox>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description (Optional)
                      </label>
                      <input
                          type="text"
                          placeholder="Add a description for this document"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                      />
                  </div>
              </div>

              {/* Upload Button */}
              <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-6 py-2 rounded-md disabled:opacity-50"
                    >
                    {isUploading ? 'Uploading...' : 'Upload Document'}
                  </button>
              </div>
          </div>
        </div>
      </div>
    )
}