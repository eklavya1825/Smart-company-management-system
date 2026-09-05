import React from "react";

const FilterDropdown = ({ value, onChange, options, placeholder = "All" }) => (
  <select className="form-select" style={{ width: "auto" }} value={value} onChange={(e) => onChange(e.target.value)}>
    <option value="">{placeholder}</option>
    {options.map((opt) => (
      <option key={opt.value ?? opt} value={opt.value ?? opt}>
        {opt.label ?? opt}
      </option>
    ))}
  </select>
);

export default FilterDropdown;
