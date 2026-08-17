import React from 'react';

export default function Button({ children, type = 'button', loading = false, disabled = false, className = '', onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn-gradient justify-center text-center ${className}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
