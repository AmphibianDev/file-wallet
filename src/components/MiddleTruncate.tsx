import { useRef, useState, useEffect } from 'react';

type MiddleTruncateProps = {
  text: string;
  minChars?: number;
  maxChars?: number;
};

const MiddleTruncate = ({
  text,
  minChars = 4,
  maxChars = Infinity,
}: MiddleTruncateProps) => {
  const [displayedText, setDisplayedText] = useState(text);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const currentElement = containerRef.current;
    if (!currentElement) return;

    const handleResize = () => {
      if (text.length <= minChars * 2 + 4) {
        setDisplayedText(text);
        return;
      }

      const effectiveWidth = getEffectiveWidth(currentElement);
      const fontStyle = getComputedStyle(currentElement).font;

      const truncatedText = getTruncatedText(
        text,
        effectiveWidth,
        fontStyle,
        minChars,
        maxChars
      );
      setDisplayedText(truncatedText);
    };

    handleResize();

    const observer = new ResizeObserver(handleResize);
    observer.observe(currentElement);

    return () => {
      observer.disconnect();
    };
  }, [text, minChars, maxChars]);

  return (
    <span style={{ display: 'block' }} ref={containerRef}>
      {displayedText}
    </span>
  );
};

export default MiddleTruncate;

const getTextWidth = (text: string, font: string) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  context.font = font;
  return context.measureText(text).width;
};

const getEffectiveWidth = (element: HTMLElement) => {
  const computedStyle = getComputedStyle(element);
  const paddingLeft = parseFloat(computedStyle.paddingLeft);
  const paddingRight = parseFloat(computedStyle.paddingRight);
  return element.offsetWidth - paddingLeft - paddingRight;
};

const getTruncatedText = (
  text: string,
  effectiveWidth: number,
  fontStyle: string,
  minChars: number,
  maxChars: number
) => {
  let chars = minChars;
  const middle = '...';

  // Try increasing the number of characters from each side while checking the width
  while (true) {
    const left = text.substring(0, chars);
    const right = text.substring(text.length - chars);
    const currentWidth = getTextWidth(left + middle + right, fontStyle);

    if (
      currentWidth <= effectiveWidth &&
      chars * 2 < text.length &&
      chars <= maxChars
    ) {
      chars++;
    } else {
      if (chars > minChars) chars--; // Rollback one iteration to fit inside the container
      break;
    }
  }

  const left = text.substring(0, chars);
  const right = text.substring(text.length - chars);
  return left + middle + right;
};
