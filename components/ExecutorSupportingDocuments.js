import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { useTempData } from '../context/tempData';
import { replaceOrAddImage } from '../utils/helpers';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

const ExecutorSupportingDocuments = ({ onSubmitToggle = 0, nextStep }) => {
  const { contextApiData, getBucketExecutor } = useApi();
  const { tempData, setValueTempData } = useTempData();
  const { locale } = useLocale();
  const t = translations[locale].executor.documents;

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingFiles, setExistingFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingFile, setIsDeletingFile] = useState(false);
  const dropRef = useRef(null);
  const submitSectionRef = useRef(null);

  const MIN_FILE_SIZE = 1024; // Minimum file size in bytes (1 KB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // Maximum file size in bytes (5 MB)

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files)
      .filter(
        (file) => file.size >= MIN_FILE_SIZE && file.size <= MAX_FILE_SIZE
      )
      .map((file) => ({
        file,
        status: 'Uploading',
        progress: 0,
      }));
    setSelectedFiles((prev) => [...prev, ...files]);
    simulateUpload(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files)
      .filter(
        (file) => file.size >= MIN_FILE_SIZE && file.size <= MAX_FILE_SIZE
      )
      .map((file) => ({
        file,
        status: 'Uploading',
        progress: 0,
      }));
    setSelectedFiles((prev) => [...prev, ...files]);
    simulateUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const IMAGE_DIRECTORY = `/executor-documents/${tempData.executor.selectedItem?.id}/`;

  const uploadToSupabase = async (file) => {
    if (tempData.executor.selectedItem?.id) {
      try {
        const result = await replaceOrAddImage({
          userId: contextApiData.user.data?.id,
          directory: IMAGE_DIRECTORY,
          imageInput: { files: [file] },
        });

        if (result?.error) throw result.error;

        return {
          path: result?.path,
          url: `${process.env.NEXT_PUBLIC_CDNUR_IMAGE}/${result?.path}`,
        };
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Failed to upload file');
        throw error;
      }
    } else {
      toast.error('Id not found');
    }
  };

  const simulateUpload = (files) => {
    files.forEach((fileObj) => {
      const interval = setInterval(() => {
        setSelectedFiles((prev) => {
          const updatedFiles = [...prev];
          const file = updatedFiles.find((f) => f.file === fileObj.file);
          if (file.progress < 100) {
            file.progress += 10;
          } else {
            file.status = 'Ready';
            clearInterval(interval);
            submitSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
          }
          return updatedFiles;
        });
      }, 500);
    });
  };

  const fetchExistingFiles = async () => {
    try {
      setIsLoading(true);

      const result = await getBucketExecutor({
        executorId: tempData.executor.selectedItem?.id,
      });

      setExistingFiles(result ? result : []);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to load existing files');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFile = async (fileToDelete) => {
    if (!window.confirm(t.confirm_delete)) return;

    try {
      setIsDeletingFile(true);

      const result = await replaceOrAddImage({
        returnData: {
          image_path: `${contextApiData.user.data?.id}${IMAGE_DIRECTORY}${fileToDelete.name}`,
        },
        deleted: true,
      });

      if (result) {
        const updatedFiles = existingFiles.filter(
          (file) => file.name !== fileToDelete.name
        );

        setExistingFiles(updatedFiles);

        toast.success(t.file_deleted);
      } else {
        toast.error(t.file_delete_failed);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error(t.file_delete_failed);
    } finally {
      setIsDeletingFile(false);
    }
  };

  useEffect(() => {
    fetchExistingFiles();
  }, []);

  useEffect(() => {
    if (onSubmitToggle > 0) {
      nextStep();
    }
  }, [onSubmitToggle]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const readyFiles = selectedFiles.filter((f) => f.status === 'Ready');

      if (readyFiles.length === 0) {
        toast.error(t.no_files_ready);
        return;
      }

      const uploadedFiles = [];
      for (const fileObj of readyFiles) {
        try {
          setSelectedFiles((prev) => {
            const updatedFiles = [...prev];
            const file = updatedFiles.find((f) => f.file === fileObj.file);
            file.status = 'Uploading';
            return updatedFiles;
          });

          const result = await uploadToSupabase(fileObj.file);

          uploadedFiles.push({
            url: result.url,
            path: result.path,
            name: fileObj.file.name,
            size: fileObj.file.size,
            type: fileObj.file.type,
          });

          setSelectedFiles((prev) => {
            const updatedFiles = [...prev];
            const file = updatedFiles.find((f) => f.file === fileObj.file);
            file.status = 'Uploaded';
            return updatedFiles;
          });

          fetchExistingFiles();
        } catch (error) {
          setSelectedFiles((prev) => {
            const updatedFiles = [...prev];
            const file = updatedFiles.find((f) => f.file === fileObj.file);
            file.status = 'Error';
            file.error = error.message;
            return updatedFiles;
          });
        }
      }

      if (uploadedFiles.length > 0) {
        toast.success(t.files_uploaded);
        if (nextStep) nextStep();
      } else {
        toast.error(t.no_files_uploaded);
      }
    } catch (error) {
      console.error('Error submitting files:', error);
      toast.error(t.submit_error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '100%' }}>
      {!isLoading && existingFiles.length > 0 && (
        <div className="card mb-4">
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
            }}
          >
            {t.existing_documents}
          </h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {existingFiles.map((file, index) => (
              <li
                key={index}
                style={{
                  backgroundColor: '#f7fafc',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      margin: 0,
                    }}
                  >
                    {file.name}
                  </p>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: '#718096',
                      margin: '2px 0',
                    }}
                  >
                    {formatFileSize(file.metadata.size)}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`${process.env.NEXT_PUBLIC_CDNUR_IMAGE}/${contextApiData.user.data?.id}${IMAGE_DIRECTORY}${file.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-primary btn-sm"
                  >
                    {t.view}
                  </a>
                  <button
                    class="btn btn-danger btn-sm"
                    onClick={() => handleDeleteFile(file)}
                    disabled={isDeletingFile}
                    style={{
                      opacity: isDeletingFile ? 0.7 : 1,
                    }}
                  >
                    {t.delete}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card">
        <div
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            border: '2px dashed',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            backgroundColor: isDragging ? '#ebf8ff' : '#f7fafc',
            borderColor: isDragging ? '#4299e1' : '#cbd5e0',
            transition: 'background-color 0.3s, border-color 0.3s',
          }}
        >
          <Image
            src={'images/small-plus.svg'}
            alt="image"
            width={0}
            height={0}
            sizes="100vw"
            style={{
              width: '10%',
              height: '10%',
            }}
          />
          <p>
            <label
              htmlFor="file-upload"
              style={{
                color: '#4299e1',
                textDecoration: 'underline',
                marginTop: '8px',
                display: 'block',
                cursor: 'pointer',
              }}
            >
              {t.browse_file}
            </label>
          </p>
          <input
            id="file-upload"
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            multiple
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
          />
          <p
            style={{ fontSize: '0.875rem', color: '#718096', marginTop: '8px' }}
          >
            {t.supported_files}
          </p>
          <p
            style={{ fontSize: '0.875rem', color: '#e53e3e', marginTop: '8px' }}
          >
            {t.file_size_limit}
          </p>
        </div>
        <div>
          {selectedFiles.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  marginTop: '1rem',
                }}
              >
                {t.uploaded_files}
              </h3>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {selectedFiles.map((fileObj, index) => (
                  <li
                    key={index}
                    style={{
                      backgroundColor: '#f7fafc',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      marginBottom: '0.5rem',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          margin: 0,
                          wordBreak: 'break-all',
                        }}
                      >
                        {fileObj.file.name}
                      </p>
                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: '#718096',
                          margin: '2px 0',
                        }}
                      >
                        {formatFileSize(fileObj.file.size)}
                      </p>
                    </div>
                    {fileObj.status === 'Uploading' && (
                      <div
                        style={{
                          width: '100%',
                          backgroundColor: '#e2e8f0',
                          borderRadius: '4px',
                          height: '8px',
                          margin: '8px 0',
                        }}
                      >
                        <div
                          style={{
                            width: `${fileObj.progress}%`,
                            backgroundColor: '#4299e1',
                            height: '8px',
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '8px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {fileObj.status === 'Uploaded' && (
                          <Image
                            src={'images/check.svg'}
                            alt="Uploaded"
                            width={16}
                            height={16}
                            style={{ display: 'block' }}
                          />
                        )}
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: '#4a5568',
                          }}
                        >
                          {fileObj.status}
                        </span>
                      </div>
                      <button
                        class="btn btn-danger btn-sm"
                        onClick={() =>
                          setSelectedFiles((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      >
                        {t.remove}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div
                ref={submitSectionRef}
                style={{
                  marginTop: '1rem',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  padding: '0.5rem',
                }}
              >
                <button
                  class="btn btn-primary btn-text"
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    selectedFiles.some((f) => f.status === 'Uploading')
                  }
                  style={{
                    opacity:
                      isSubmitting ||
                      selectedFiles.some((f) => f.status === 'Uploading')
                        ? 0.7
                        : 1,
                  }}
                >
                  {isSubmitting ? t.submitting : t.submit_files}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutorSupportingDocuments;
