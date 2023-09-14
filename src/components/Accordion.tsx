import React, { useState, useRef, useEffect } from 'react';
import AccordionCSS from './Accordion.module.css';

type Props = {
  title: string;
  children: React.ReactNode;
};

const Accordion = ({ title, children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

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
    <div className={AccordionCSS.container} role="region">
      <button
        role="button"
        id="accordion-header"
        aria-controls="accordion-content"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={AccordionCSS.header}
      >
        <h2>{title}</h2>
        <div className="x-btn"></div>
      </button>
      <div
        ref={contentRef}
        id="accordion-content"
        aria-labelledby="accordion-header"
        hidden={!isOpen}
        className={AccordionCSS.content}
      >
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
