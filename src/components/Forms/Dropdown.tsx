import { useState } from "react";

import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import "./Dropdown.scss";

interface DropdownProps {
  buttonText: string;
  content: string[];
  onSelect: (el: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({ buttonText, content, onSelect }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedContent, setContent] = useState<string>(buttonText);
  const [isSelected, setSelected] = useState<boolean>(false);

  const handleSelect = (el: string) => {
    setContent(el);
    setOpen(false);
    setSelected(true);
    onSelect(el);
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
