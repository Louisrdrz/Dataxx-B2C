import { useState, useCallback, useRef } from 'react';
import { ExtractedWorkspaceData } from '@/lib/openai/deckAnalyzer';

interface DeckUploaderProps {
  workspaceId?: string;
  userId: string;
  onDataExtracted: (data: ExtractedWorkspaceData & { 
    fileURL?: string; 
    fileName?: string;
    fileSize?: number;
  }) => void;
  onError?: (error: string) => void;
}

export default function DeckUploader({ 
  workspaceId, 
  userId, 
  onDataExtracted,
  onError 
}: DeckUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    // Vérifier le type de fichier
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
      'application/msword', // DOC
      'application/vnd.ms-powerpoint', // PPT
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
    ];

    if (!validTypes.includes(file.type) && 
        !file.name.match(/\.(pdf|docx?|pptx?)$/i)) {
      onError?.('Format de fichier non supporté. Utilisez PDF, DOCX ou PPTX.');
      return;
    }

    // Vérifier la taille (50 MB max)
    if (file.size > 50 * 1024 * 1024) {
      onError?.('Le fichier est trop volumineux. Taille maximale : 50 MB.');
      return;
    }

    setSelectedFile(file);
  }, [onError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };


  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Étape 1 : Upload du fichier dans Firebase Storage (depuis le client)
      const { storage } = await import('@/lib/firebase/config');
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      
      const workspaceIdToUse = workspaceId || 'temp_' + Date.now();
      const sanitizedFileName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `workspaces/${workspaceIdToUse}/decks/${Date.now()}_${sanitizedFileName}`;
      
      const storageRef = ref(storage, storagePath);
      
      setUploadProgress(20);
      
      // Upload le fichier
      await uploadBytes(storageRef, selectedFile, {
        contentType: selectedFile.type,
        customMetadata: {
          workspaceId: workspaceIdToUse,
          originalFileName: selectedFile.name,
          uploadedAt: new Date().toISOString(),
          uploadedBy: userId,
        }
      });
      
      setUploadProgress(40);
      
      // Récupérer l'URL du fichier
      const fileURL = await getDownloadURL(storageRef);
      
      setUploadProgress(50);

      // Étape 2 : Envoyer au serveur pour l'analyse OpenAI
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userId', userId);
      formData.append('workspaceId', workspaceIdToUse);
      formData.append('fileURL', fileURL); // Passer l'URL du fichier uploadé

      setUploadProgress(60);

      const response = await fetch('/api/upload-deck', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(80);

      const result = await response.json();

      setUploadProgress(100);

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erreur lors de l\'analyse');
      }

      // Ajouter l'URL du fichier aux données
      result.data.fileURL = fileURL;
      result.data.fileName = selectedFile.name;
      result.data.fileSize = selectedFile.size;

      // Appeler le callback avec les données extraites
      onDataExtracted(result.data);
      
      // Reset
      setSelectedFile(null);
      setIsUploading(false);
      setUploadProgress(0);
    } catch (error: any) {
      console.error('Erreur upload:', error);
      onError?.(error.message || 'Erreur lors de l\'upload du fichier');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
            transition-all duration-200
            ${isDragging 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50'
            }
          `}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-white rounded-2xl shadow-sm">
              <svg 
                className="w-12 h-12 text-indigo-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-800 mb-1">
                Glissez-déposez votre deck commercial
              </p>
              <p className="text-sm text-slate-600">
                ou cliquez pour sélectionner un fichier
              </p>
            </div>
            <div className="text-xs text-slate-500">
              Formats acceptés : PDF, DOCX, PPTX • Taille max : 50 MB
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.pptx,.ppt"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="border-2 border-indigo-200 rounded-2xl p-8 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <svg 
                  className="w-8 h-8 text-indigo-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-lg mb-1">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-slate-600">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            {!isUploading && (
              <button
                onClick={() => setSelectedFile(null)}
                className="text-slate-400 hover:text-red-600 transition-colors p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {isUploading && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Analyse en cours...
                </span>
                <span className="text-sm font-medium text-indigo-600">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-3 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-slate-600 mt-2 text-center">
                L'IA analyse votre document pour extraire les informations...
              </p>
            </div>
          )}

          {!isUploading && (
            <button
              onClick={handleUpload}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Analyser le document avec l'IA
            </button>
          )}
        </div>
      )}
    </div>
  );
}

