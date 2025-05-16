import { useState, useEffect } from "react";

import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import "./Dropdown.scss";
import { CATEGORIES as QUEST_CATEGORIES } from "@/constants/questConstants";
import { useQuestFormContext } from "@/contexts/QuestFormContext";

interface DropdownProps {
  buttonText: string;
  onSelect: (el: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({ buttonText, onSelect }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedContent, setContent] = useState<string>(buttonText);
  const [isSelected, setSelected] = useState<boolean>(false);

  const { category } = useQuestFormContext();

  const handleSelect = (el: string) => {
    setContent(el);
    setOpen(false);
    setSelected(true);
    onSelect(el);
  };

  useEffect(() => {
    if (category) {
      setContent(category);
      setSelected(true);
    } else {
      setContent(buttonText);
      setSelected(false);
    }
  }, [category, buttonText]);

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
          {QUEST_CATEGORIES.map((el) => (
            <div className="dropdown-element" onClick={() => handleSelect(el)}>
              {el}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
