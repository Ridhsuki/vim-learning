import React, { useState, useRef, useEffect } from 'react';

export default function App() {
  // State untuk menyimpan mode saat ini dan isi teks
  const [mode, setMode] = useState('NORMAL');
  const [text, setText] = useState(
    'Halo! Ini adalah prototipe Vim interaktif.\n\n1. Tekan "i" untuk masuk ke INSERT mode dan mulai mengetik.\n2. Tekan "Escape" (Esc) untuk kembali ke NORMAL mode.\n\nSelamat mencoba!'
  );

  const textareaRef = useRef(null);

  // Menangani input keyboard
  const handleKeyDown = (e) => {
    if (mode === 'NORMAL') {
      // Jika di mode NORMAL dan menekan 'i', pindah ke INSERT
      if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        setMode('INSERT');
      }
      // Blokir input lain di mode NORMAL (kecuali kombinasi browser bawaan seperti Ctrl+R)
      else if (!e.metaKey && !e.ctrlKey) {
        e.preventDefault();
      }
    } else if (mode === 'INSERT') {
      // Jika di mode INSERT dan menekan 'Escape', kembali ke NORMAL
      if (e.key === 'Escape') {
        e.preventDefault();
        setMode('NORMAL');
      }
    }
  };

  // Pastikan area teks selalu fokus setiap kali mode berubah
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [mode]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-green-400 font-mono text-lg overflow-hidden">
      {/* Editor Area */}
      <textarea
        ref={textareaRef}
        className={`flex-grow bg-transparent outline-none resize-none p-4 w-full h-full ${mode === 'NORMAL' ? 'cursor-default' : 'cursor-text'
          }`}
        value={text}
        onChange={(e) => mode === 'INSERT' && setText(e.target.value)}
        onKeyDown={handleKeyDown}
        readOnly={mode === 'NORMAL'}
        spellCheck="false"
        autoFocus
      />

      {/* Status Bar (Vim Style) */}
      <div className="bg-gray-800 text-white px-4 py-1 flex justify-between items-center border-t border-gray-700">
        <span className="font-bold uppercase tracking-wider">
          {mode === 'NORMAL' ? '' : '-- INSERT --'}
        </span>
        <span className="text-sm text-gray-400">
          Vim Web Tutor - {mode} MODE
        </span>
      </div>
    </div>
  );
}