import React, { useState, useEffect, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';

const ColorSpectrumSelector = ({ initialColor, onChange, label }) => {
  const [localColor, setLocalColor] = useState(initialColor);

  // Debounce the onChange callback to prevent too many updates
  const debouncedOnChange = useCallback(
    debounce((color) => {
      onChange(color);
    }, 100),
    [onChange]
  );

  useEffect(() => {
    setLocalColor(initialColor);
  }, [initialColor]);

  const handleColorChange = (color) => {
    setLocalColor(color);
    debouncedOnChange(color);
  };

  const handleHexInputChange = (e) => {
    const value = e.target.value;
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      setLocalColor(value);
      if (value.length === 7) {
        // Only trigger onChange when we have a valid hex color
        debouncedOnChange(value);
      }
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="flex items-start gap-4">
        <HexColorPicker
          color={localColor}
          onChange={handleColorChange}
          className="!w-[200px]"
        />
        <div className="flex flex-col gap-2">
          <div
            className="w-12 h-12 rounded-lg border shadow-sm"
            style={{ backgroundColor: localColor }}
            title="Current color"
          />
          <input
            type="text"
            value={localColor}
            onChange={handleHexInputChange}
            className="w-20 text-sm border rounded px-2 py-1"
            placeholder="#000000"
            title="Color hex value"
          />
        </div>
      </div>
    </div>
  );
};

ColorSpectrumSelector.propTypes = {
  initialColor: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};

export default ColorSpectrumSelector;
