import React, { useState, useRef } from 'react';
import { UploadCloud, FolderArchive, Download, CheckCircle, AlertCircle, RefreshCw, FileCode } from 'lucide-react';
import { processZipArchive } from '../utils/zipHandler';
import { formatBytes } from '../utils/metrics';
import type { ObfuscatorConfig } from '../types/obfuscator';

interface BatchProcessorProps {
  config: ObfuscatorConfig;
}

export const BatchProcessor: React.FC<BatchProcessorProps> = ({ config }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<{ current: number; total: number; currentFile: string } | null>(null);
  const [completedZipBlob, setCompletedZipBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.zip')) {
        setError('Please upload a .zip archive containing your project or scripts.');
        return;
      }
      setSelectedFile(file);
      setCompletedZipBlob(null);
      setError(null);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setError(null);
    setProgress(null);

    try {
      const resultBlob = await processZipArchive(
        selectedFile,
        config,
        (current, total, currentFile) => {
          setProgress({ current, total, currentFile });
        }
      );
      setCompletedZipBlob(resultBlob);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to process zip archive.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!completedZipBlob || !selectedFile) return;
    const url = URL.createObjectURL(completedZipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name.replace(/\.zip$/i, '-obfuscated.zip');
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col flex-1 border border-slate-800 rounded-2xl bg-slate-900/60 p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <FolderArchive className="w-5 h-5 text-cyan-400" />
          <span>Project & Multi-File Batch Obfuscator</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Protect complete bundles or distribution archives. All <code>.js</code>, <code>.mjs</code>, and <code>.cjs</code> files
          will be obfuscated in-browser while preserving HTML, CSS, images, and folder trees.
        </p>
      </div>

      {/* Drop Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-700 hover:border-cyan-500/80 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition bg-slate-950/40 hover:bg-slate-950/80 group"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".zip"
          className="hidden"
        />
        <div className="p-4 rounded-2xl bg-slate-900 group-hover:bg-cyan-950/50 border border-slate-800 group-hover:border-cyan-800 transition mb-3">
          <UploadCloud className="w-8 h-8 text-cyan-400" />
        </div>
        <p className="text-sm font-semibold text-slate-200">
          {selectedFile ? selectedFile.name : 'Click or drag a .zip file here'}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          {selectedFile
            ? `Size: ${formatBytes(selectedFile.size)} — Ready to transform`
            : 'Supports distribution directories, webpack/vite dist zips, and script packages'}
        </p>
      </div>

      {/* Progress & Actions */}
      <div className="flex flex-col space-y-4">
        {error && (
          <div className="bg-rose-950/60 border border-rose-800 rounded-xl px-4 py-3 flex items-center space-x-3 text-rose-300 text-xs">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isProcessing && progress && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center space-x-2">
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>Processing: {progress.currentFile}</span>
              </span>
              <span className="font-mono text-cyan-400 font-semibold">
                {progress.current} / {progress.total} JS files
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
                style={{ width: `${Math.round((progress.current / progress.total) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {completedZipBlob && (
          <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold">Transformation Complete!</span>
                <p className="text-[11px] text-emerald-400/80">
                  All JavaScript assets successfully obfuscated and repacked ({formatBytes(completedZipBlob.size)}).
                </p>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download Obfuscated ZIP</span>
            </button>
          </div>
        )}

        {selectedFile && !completedZipBlob && (
          <div className="flex justify-end">
            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-cyan-950 transition"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Obfuscating Project...</span>
                </>
              ) : (
                <>
                  <FileCode className="w-4 h-4" />
                  <span>Start Batch Obfuscation</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
