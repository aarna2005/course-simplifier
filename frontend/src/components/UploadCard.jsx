/**
 * UploadCard.jsx
 * --------------
 * Handles file upload (drag-and-drop + click) OR manual text paste,
 * learner level selection, and the Simplify button.
 *
 * Props:
 *   onSimplify(text, level)  – called when the user clicks Simplify
 *   loading                  – bool, disables the form during AI call
 */

import React, { useState, useRef, useCallback } from 'react';
import { uploadFile } from '../api';

const LEVELS = [
  { value: 'beginner',            label: 'Beginner' },
  { value: 'intermediate',        label: 'Intermediate' },
  { value: 'high_school',         label: 'High School Student' },
  { value: 'undergraduate',       label: 'Undergraduate Student' },
  { value: 'engineering_student', label: 'Engineering Student' },
  { value: 'expert',              label: 'Expert' },
];

const ACCEPTED_TYPES = '.pdf,.docx,.txt';

export default function UploadCard({ onSimplify, loading }) {
  const [mode, setMode]               = useState('file'); // 'file' | 'text'
  const [file, setFile]               = useState(null);
  const [pastedText, setPastedText]   = useState('');
  const [level, setLevel]             = useState('beginner');
  const [extractedText, setExtracted] = useState('');
  const [uploadStatus, setUploadStatus] = useState(null); // null | 'uploading' | 'done' | 'error'
  const [errorMsg, setErrorMsg]       = useState('');
  const [dragOver, setDragOver]       = useState(false);
  const fileInputRef                  = useRef(null);

  // ── Drag-and-drop handlers ──────────────────────────────────────────────
  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) await handleFileSelect(dropped);
  }, []); // eslint-disable-line

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  // ── File selection ──────────────────────────────────────────────────────
  async function handleFileSelect(selectedFile) {
    setFile(selectedFile);
    setErrorMsg('');
    setUploadStatus('uploading');
    try {
      const data = await uploadFile(selectedFile);
      setExtracted(data.text);
      setUploadStatus('done');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to extract text from file.';
      setErrorMsg(msg);
      setUploadStatus('error');
    }
  }

  // ── Submit ──────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');

    const finalText = mode === 'file' ? extractedText : pastedText;
    if (!finalText.trim()) {
      setErrorMsg(mode === 'file' ? 'Please upload a file first.' : 'Please paste some text.');
      return;
    }

    onSimplify(finalText.trim(), level);
  }

  // ── Rendering ───────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
      {/* Mode toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          type="button"
          onClick={() => { setMode('file'); setErrorMsg(''); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'file'
              ? 'bg-white shadow text-ibm-gray-100 font-semibold'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📁 Upload File
        </button>
        <button
          type="button"
          onClick={() => { setMode('text'); setErrorMsg(''); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'text'
              ? 'bg-white shadow text-ibm-gray-100 font-semibold'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          ✏️ Paste Text
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ── File upload ── */}
        {mode === 'file' && (
          <div>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-ibm-blue bg-blue-50'
                  : uploadStatus === 'done'
                  ? 'border-green-400 bg-green-50'
                  : uploadStatus === 'error'
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-300 hover:border-ibm-blue hover:bg-blue-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES}
                className="hidden"
                onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
              />

              {uploadStatus === 'uploading' ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-ibm-blue border-t-transparent rounded-full spinner" />
                  <p className="text-sm text-gray-600">Extracting text…</p>
                </div>
              ) : uploadStatus === 'done' ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">✅</div>
                  <p className="text-sm font-medium text-green-700">{file?.name}</p>
                  <p className="text-xs text-gray-500">{extractedText.length.toLocaleString()} characters extracted</p>
                  <p className="text-xs text-ibm-blue underline cursor-pointer">Click to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="text-4xl">📂</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Drop your file here or <span className="text-ibm-blue">browse</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Supports PDF, DOCX, TXT</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Paste text ── */}
        {mode === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Paste your educational content
            </label>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste lecture notes, textbook excerpts, or any educational content here…"
              rows={8}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ibm-blue focus:border-transparent resize-y transition"
            />
            <p className="text-xs text-gray-400 mt-1">
              {pastedText.length.toLocaleString()} characters
            </p>
          </div>
        )}

        {/* ── Learner level ── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            🎓 Select Learner Level
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-ibm-blue focus:border-transparent transition appearance-none cursor-pointer"
          >
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* ── Error message ── */}
        {errorMsg && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ── Submit button ── */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all ${
            loading
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-ibm-blue hover:bg-ibm-blue-dark active:scale-[0.98] text-white shadow-md hover:shadow-lg'
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full spinner" />
              <span>IBM watsonx.ai is thinking…</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>Simplify with AI</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
