import React from 'react';

interface MahjongRadioProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  className?: string;
}

const MahjongRadio: React.FC<MahjongRadioProps> = ({ name, value, checked, onChange, label, className }) => (
  <label className={`mahjong-radio-label${checked ? ' selected' : ''} ${className || ''}`.trim()}>
    <input
      type="radio"
      className="mahjong-radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
    />
    {label}
  </label>
);

export default MahjongRadio;
