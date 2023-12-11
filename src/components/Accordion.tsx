import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AccordionCSS from './Accordion.module.css';

function toId(str: string) {
  // Convert to lowercase and replace spaces with underscores
  const id = str.toLowerCase().replace(/\s+/g, '_');
  // Remove special characters except underscores
  const cleanedId = id.replace(/[^\w\s]/gi, '');

  return cleanedId;
}

type Props = {
  title: string;
  children: React.ReactNode;
};

const Accordion = ({ title, children }: Props) => {
  const [id] = useState(() => toId(title));
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLButtonElement | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    const hashId = location.hash.substring(1);
    if (hashId === id) navigate('', { replace: true });
    else navigate('#' + id, { replace: true });
  };

  useEffect(() => {
    const hashId = location.hash.substring(1);
    if (hashId === id) {
      setTimeout(() => {
        contentRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 200);
    }

    setIsOpen(hashId === id);
  }, [location, id]);

  // remove tab focus from content when accordion is closed
  useEffect(() => {
    const focusableElements = contentRef.current?.querySelectorAll(
      'a, button, input, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements) {
      Array.from(focusableElements).forEach(el => {
        if (isOpen) {
          el.setAttribute('tabindex', '0');
        } else {
          el.setAttribute('tabindex', '-1');
        }
      });
    }
  }, [isOpen]);

  return (
    <div id={id} className={AccordionCSS.container} role="region">
      <button
        ref={headerRef}
        id={`${id}-header`}
        aria-owns={`${id}-content`}
        aria-expanded={isOpen}
        onClick={handleClick}
        className={AccordionCSS.header}
      >
        <h2>{title}</h2>
        <div className="x-btn"></div>
      </button>
      <div
        ref={contentRef}
        id={`${id}-content`}
        aria-labelledby={`${id}-header`}
        aria-hidden={!isOpen}
        className={AccordionCSS.content}
      >
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
