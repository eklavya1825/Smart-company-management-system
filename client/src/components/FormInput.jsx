import React from "react";

export const FormInput = ({ label, ...props }) => (
  <div className="form-group">
    {label && <label className="form-label">{label}</label>}
    <input className="form-input" {...props} />
  </div>
);

export const FormTextarea = ({ label, ...props }) => (
  <div className="form-group">
    {label && <label className="form-label">{label}</label>}
    <textarea className="form-textarea" rows={3} {...props} />
  </div>
);

export const SelectInput = ({ label, options = [], ...props }) => (
  <div className="form-group">
    {label && <label className="form-label">{label}</label>}
    <select className="form-select" {...props}>
      {options.map((opt) => (
        <option key={opt.value ?? opt} value={opt.value ?? opt}>
          {opt.label ?? opt}
        </option>
      ))}
    </select>
  </div>
);
