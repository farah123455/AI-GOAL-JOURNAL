import React from 'react';

export default function Input({ id, label, type = 'text', placeholder, value, onChange, required = false, className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="form-input-tailwind"
      />
    </div>
  );
}
