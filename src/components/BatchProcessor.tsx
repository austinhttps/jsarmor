import React, { useState, useRef } from 'react';
import { UploadCloud, FolderArchive, Download, CheckCircle2, AlertCircle, RefreshCw, FileCode } from 'lucide-react';
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
    <div className="flex flex-col flex-1 border border-[#1d222e] rounded-xl bg-[#0d0f17] p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-100 flex items-center space-x-2">
          <FolderArchive className="w-5 h-5 text-slate-300" />
          <span>Project & Bundle Archive Protection</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Safeguards whole distribution bundles. All <code>.js</code>, <code>.mjs</code>, and <code>.cjs</code> files
          are rewritten while leaving HTML, CSS, images, JSON, and directories completely intact.
        </p>
      </div>

      {/* Drop Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border border-dashed border-[#262e3f] hover:border-[#404c66] rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition bg-[#090b11] hover:bg-[#0c0e16]"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".zip"
          className="hidden"
        />
        <div className="p-3.5 rounded-xl bg-[#141824] border border-[#212738] mb-3 text-slate-300">
          <UploadCloud className="w-6 h-6 stroke-[1.8]" />
        </div>
        <p className="text-xs font-semibold text-slate-200">
          {selectedFile ? selectedFile.name : 'Select or drop a project .zip archive'}
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          {selectedFile
            ? `Archive size: ${formatBytes(selectedFile.size)}`
            : 'Compatible with Vite, Webpack, Rollup distribution folders'}
        </p>
      </div>

      {/* Progress & Actions */}
      <div className="flex flex-col space-y-4">
        {error && (
          <div className="bg-[#1e1317] border border-rose-900/60 rounded-xl px-4 py-3 flex items-center space-x-3 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isProcessing && progress && (
          <div className="bg-[#090b10] border border-[#1d222e] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <span className="flex items-center space-x-2 truncate max-w-md">
                <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin shrink-0" />
                <span className="truncate">Processing: {progress.currentFile}</span>
              </span>
              <span className="text-slate-300 font-semibold">
                {progress.current} / {progress.total}
              </span>
            </div>
            <div className="w-full bg-[#161a26] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-slate-200 h-full transition-all duration-300"
                style={{ width: `${Math.round((progress.current / progress.total) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {completedZipBlob && (
          <div className="bg-[#0f1715] border border-emerald-900/60 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold text-emerald-200">Batch Transformation Successful</span>
                <p className="text-[11px] text-emerald-400/80">
                  All scripts protected ({formatBytes(completedZipBlob.size)}).
                </p>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Protected ZIP</span>
            </button>
          </div>
        )}

        {selectedFile && !completedZipBlob && (
          <div className="flex justify-end">
            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className="flex items-center space-x-2 px-5 py-2 rounded-lg bg-slate-100 hover:bg-white disabled:opacity-40 text-slate-950 font-semibold text-xs transition"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Obfuscating Project...</span>
                </>
              ) : (
                <>
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Protect Project Archive</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
