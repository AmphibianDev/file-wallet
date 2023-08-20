import { useState, useEffect, useRef } from 'react';

import TextZoneCSS from './TextZone.module.css';

const TextZone = () => {
  const [selfValue, setSelfValue] = useState('');

  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (ref && ref.current) {
      ref.current.style.height = '0px';
      ref.current.style.height = ref.current.scrollHeight.toString() + 'px';
    }
  }, [selfValue]);

  return (
    <div className={TextZoneCSS.container}>
      <textarea
        placeholder="Seed here.."
        spellCheck={false}
        ref={ref}
        value={selfValue}
        onChange={e => setSelfValue(cleanString(e.target.value))}
      ></textarea>
    </div>
  );
};

function cleanString(value: string) {
  return value
    .replace(/(\r\n|\n|\r)/gm, ' ')
    .replace(/\s+/g, ' ')
    .replace(/ +$/, ' ');
}

export default TextZone;
