

import React, { useState, useCallback, useRef } from 'react';
import type { GeneratedImageResult } from './types';
import { generateImageWithPrompt, generateImageFromText } from './services/geminiService';
import { templateGroups } from './promptTemplates';

const UploadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
);

const Spinner: React.FC<{className?: string}> = ({ className }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const DownloadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const CloseIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface ImageUploaderProps {
    onImagesSelect: (files: FileList | null) => void;
    previewUrls: string[];
    onImageRemove: (index: number) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesSelect, previewUrls, onImageRemove }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onImagesSelect(event.target.files);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            const imageFiles = new DataTransfer();
            Array.from(event.dataTransfer.files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    imageFiles.items.add(file);
                }
            });
            onImagesSelect(imageFiles.files);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {previewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square group">
                        <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                        <button
                            onClick={() => onImageRemove(index)}
                            aria-label={`Remove image ${index + 1}`}
                            className="absolute top-1 right-1 p-1 bg-gray-900/70 text-white rounded-full hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}
                <label
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col justify-center items-center w-full aspect-square rounded-lg border-2 border-dashed border-gray-600/80 transition-colors hover:border-purple-500 hover:bg-gray-800/60 text-gray-400"
                >
                    <UploadIcon className="h-8 w-8" />
                    <span className="mt-1 text-xs text-center px-1">Add Image(s)</span>
                    <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </label>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [selectedGroupTitle, setSelectedGroupTitle] = useState('');
  const [selectedTemplateTitle, setSelectedTemplateTitle] = useState('');
  const [generatedResult, setGeneratedResult] = useState<GeneratedImageResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImagesSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    setSelectedImages(prev => [...prev, ...newFiles]);

    const newUrlPromises = newFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newUrlPromises).then(newUrls => {
      setPreviewUrls(prev => [...prev, ...newUrls]);
    });
    setError(null);
  };

  const handleImageRemove = (indexToRemove: number) => {
    setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setPreviewUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const handleGroupChange = (groupTitle: string) => {
    setSelectedGroupTitle(groupTitle);
    setSelectedTemplateTitle('');
    setPrompt('');
  };

  const handleTemplateSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTitle = e.target.value;
    setSelectedTemplateTitle(selectedTitle);

    if (selectedTitle) {
      const group = templateGroups.find(g => g.groupTitle === selectedGroupTitle);
      const template = group?.templates.find(t => t.title === selectedTitle);
      if (template) {
        setPrompt(template.prompt);
      }
    } else {
      setPrompt('');
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    if(selectedTemplateTitle){
        const isStillTemplate = templateGroups.some(g => g.templates.some(t => t.title === selectedTemplateTitle && t.prompt === e.target.value));
        if(!isStillTemplate) {
            setSelectedTemplateTitle('');
        }
    }
  };

  const handleClearPrompt = () => {
    setPrompt('');
    setSelectedTemplateTitle('');
  };

  const handleDownload = () => {
    if (!generatedResult?.imageUrl) return;
    const link = document.createElement('a');
    link.href = generatedResult.imageUrl;
    const mimeTypeMatch = generatedResult.imageUrl.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    const extension = mimeTypeMatch && mimeTypeMatch[1] ? mimeTypeMatch[1].split('/')[1] : 'png';
    link.download = `generated-image.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedResult(null);

    try {
      let result;
      if (selectedImages.length > 0) {
        result = await generateImageWithPrompt(selectedImages, prompt);
      } else {
        result = await generateImageFromText(prompt);
      }
      
      setGeneratedResult(result);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedImages, prompt]);

  const canGenerate = !isLoading && (selectedImages.length > 0 || prompt.trim() !== '');

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
      <header className="text-center p-6 border-b border-gray-700/50">
        <h1 className="text-3xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          Image Transformer
        </h1>
        <p className="mt-2 text-sm italic text-gray-400">
          Your creative partner for AI-powered image generation and editing.
        </p>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column */}
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-gray-200 border-b border-gray-700 pb-2">1. Upload & Prompt</h2>
          
          <ImageUploader 
            onImagesSelect={handleImagesSelect}
            previewUrls={previewUrls}
            onImageRemove={handleImageRemove}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Prompt Type</label>
            <div className="flex gap-4 mb-4">
              {templateGroups.map((group) => (
                <button
                  key={group.groupTitle}
                  type="button"
                  onClick={() => handleGroupChange(group.groupTitle)}
                  className={`relative inline-flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors focus:z-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 w-1/2 rounded-md shadow-sm
                    ${selectedGroupTitle === group.groupTitle
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`
                  }
                >
                  {group.groupTitle}
                </button>
              ))}
            </div>

            {selectedGroupTitle && (
              <div className="relative mb-3">
                <select
                  onChange={handleTemplateSelectChange}
                  value={selectedTemplateTitle}
                  aria-label="Select a prompt template"
                  className="appearance-none block w-full rounded-md border-gray-600 bg-gray-700/80 text-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-3 transition hover:bg-gray-700 cursor-pointer"
                >
                  <option value="">Select a template...</option>
                  {templateGroups.find(g => g.groupTitle === selectedGroupTitle)?.templates.map((template) => (
                    <option key={template.title} value={template.title}>
                      {template.title}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            )}

            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-1">Or write your own prompt</label>
            <div className="relative">
                <textarea
                  id="prompt"
                  name="prompt"
                  rows={8}
                  className="block w-full rounded-md border-gray-600 bg-gray-700/80 text-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-3 transition pr-10"
                  placeholder="Describe the image you want to create or edit..."
                  value={prompt}
                  onChange={handlePromptChange}
                />
                {prompt && (
                    <button
                        onClick={handleClearPrompt}
                        aria-label="Clear prompt"
                        className="absolute top-3 right-3 p-1 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-600/50"
                    >
                        <CloseIcon className="h-5 w-5" />
                    </button>
                )}
            </div>
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!canGenerate}
            className={`w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105`}
          >
            {isLoading ? (
              <>
                <Spinner className="w-5 h-5 mr-3" />
                Generating...
              </>
            ) : (
             <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 01-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 013.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 013.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 01-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.25l-.648-1.688a2.25 2.25 0 01-1.423-1.423L12.5 18.5l1.688-.648a2.25 2.25 0 011.423-1.423L17.5 15.75l.648 1.688a2.25 2.25 0 011.423 1.423l1.688.648-.648 1.688a2.25 2.25 0 01-1.423 1.423z" />
                </svg>
                Generate Image
              </>
            )}
          </button>
        </div>

        {/* Right Column */}
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg flex flex-col gap-4 self-stretch">
          <h2 className="text-xl font-semibold text-gray-200 border-b border-gray-700 pb-2">2. Generated Result</h2>
          <div className="flex-grow flex justify-center items-center w-full rounded-lg bg-gray-900/50 p-4 min-h-[200px]">
            {isLoading && (
              <div className="text-center text-gray-400">
                <Spinner className="w-12 h-12 mx-auto" />
                <p className="mt-4 text-lg">Generating your image...</p>
                <p className="text-sm">This can take a moment.</p>
              </div>
            )}
            {error && (
              <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
                  <p className="font-semibold">Generation Failed</p>
                  <p className="text-sm mt-1">{error}</p>
              </div>
            )}
            {generatedResult && !isLoading && (
              <div className="w-full h-full flex flex-col gap-4">
                {generatedResult.imageUrl ? (
                  <>
                    <div className="relative group flex-grow min-h-0">
                      <img
                        src={generatedResult.imageUrl}
                        alt="Generated"
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <button
                        onClick={handleDownload}
                        aria-label="Download image"
                        className="absolute top-2 right-2 p-2 bg-gray-900/70 text-white rounded-full hover:bg-purple-600 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none"
                      >
                        <DownloadIcon className="h-5 w-5" />
                      </button>
                    </div>
                    {generatedResult.text && (
                      <p className="text-sm text-gray-300 p-3 bg-gray-700/50 rounded-md flex-shrink-0">{generatedResult.text}</p>
                    )}
                  </>
                ) : (
                  <div className="flex-grow flex justify-center items-center text-center text-gray-300 bg-gray-900/30 p-4 rounded-lg">
                    <div>
                      <p className="font-semibold text-yellow-400">Model Response</p>
                      <p className="text-sm mt-2 whitespace-pre-wrap">{generatedResult.text}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
             {!isLoading && !error && !generatedResult && (
                <div className="text-center text-gray-500">
                    <p>Your generated image will appear here.</p>
                </div>
            )}
          </div>
        </div>
      </main>

      <footer className="text-center p-4 text-xs text-gray-400/80">
        Powered by HieuLe.
      </footer>
    </div>
  );
};

export default App;