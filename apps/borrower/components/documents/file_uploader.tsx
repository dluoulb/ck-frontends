import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faXmark, faArrowUpFromBracket } from '@fortawesome/pro-regular-svg-icons';

interface FileUploaderProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
}

export default function FileUploader({ selectedFile, onFileSelect }: FileUploaderProps) {
  const [errorMessage, setErrorMessage] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections) => {
    if (fileRejections.length > 0) {
        const firstError = fileRejections[0]?.errors?.[0];

        if (firstError?.code === 'file-too-large') {
          setErrorMessage('File is too large. Please upload a file smaller than 10MB.');
        } else if (firstError?.code === 'file-invalid-type') {
          setErrorMessage('Invalid file type. Please upload a PDF, Word doc, Excel sheet, JPG, or PNG.');
        } else {
          setErrorMessage(firstError?.message || 'Invalid file');
        }
    
        onFileSelect(null);
        return;
      }

    const file = acceptedFiles[0];
    onFileSelect(file);
    setErrorMessage('');
  }, [onFileSelect]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    noKeyboard: true,
    accept: {
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
    },
  });

  const baseStyle =
    'p-6 border-2 border-dashed rounded-md text-center transition-colors duration-200 cursor-pointer flex items-center justify-center';

  const dragActiveStyle = 'border-blue-400 bg-blue-50';
  const hoverStyle = 'hover:border-blue-400';
  const defaultStyle = 'border-gray-300';

  const combinedStyle = classNames(
    baseStyle,
    hoverStyle,
    {
      [dragActiveStyle]: isDragActive,
      [defaultStyle]: !isDragActive && !isDragReject && !isInputFocused,
      ['border-blue-400']: isInputFocused && !isDragActive && !isDragReject,
    }
  );

  const handleRemoveFile = () => {
    onFileSelect(null);
    setErrorMessage('');
  };

  return (
    <div className="space-y-4">
      <div {...getRootProps({ className: combinedStyle })}>
        <input
          {...getInputProps()}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />

        {selectedFile ? (
            <div className="flex flex-col items-center justify-center space-y-4 w-full">
                <FontAwesomeIcon icon={faFile} className="text-gray-400 w-10 h-10" />

                <div className="flex flex-col items-center space-y-1">
                    <div className="flex items-center gap-2">
                    <p className="text-gray-800 font-semibold text-base truncate max-w-[250px]">
                        {selectedFile.name}
                    </p>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile();
                        }}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Remove file"
                    >
                        <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
                    </button>
                    </div>
                    <p className="text-gray-400 text-xs">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center space-y-2">
                <FontAwesomeIcon icon={faArrowUpFromBracket} className="text-gray-400 w-8 h-8" />
                <p className="text-sm text-gray-500">
                <span className="text-blue-600 font-semibold hover:underline">
                    Click to upload
                </span>{' '}
                or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB)
                </p>
            </div>
            )}
      </div>

      {errorMessage && (
        <p className="text-red-600 text-sm">{errorMessage}</p>
      )}
    </div>
  );
}