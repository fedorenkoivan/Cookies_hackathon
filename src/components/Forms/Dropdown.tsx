import React from "react";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import './Dropdown.scss';

interface DropdownProps {
  buttonText: string;
  content: string[];
}

export const Dropdown: React.FC<DropdownProps> = ({ buttonText, content }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedContent, setContent] = useState<string>(buttonText);
  const [isSelected, setSelected] = useState<boolean>(false);

  const handleSelect = (el: string) => {
    setContent(el);
    setOpen(false);
    setSelected(true);
  };

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <div
        className={`dropdown-btn ${isSelected ? "selected" : ""} ${
          open ? "open" : ""
        }`}
        onClick={handleToggle}
      >
        {selectedContent}
        <span className="icon">
          {open ? <FaChevronDown /> : <FaChevronUp />}
        </span>
      </div>
      {open && (
        <div className="dropdown-content">
          {content.map((el) => (
            <div className="dropdown-element" onClick={() => handleSelect(el)}>
              {el}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
