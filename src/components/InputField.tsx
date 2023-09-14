import React, { useState } from 'react';

import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

import InputFieldCSS from './InputField.module.css';

const InputField = ({
  type,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  const [showText, setShowText] = useState(false);

  return (
    <>
      {type === 'password' ? (
        <div className={InputFieldCSS.container}>
          <input
            className={InputFieldCSS.input}
            type={showText ? 'text' : 'password'}
            {...props}
          />
          <button
            className={InputFieldCSS.switchIcon}
            aria-pressed={showText}
            aria-label={showText ? 'hide password' : 'show password'}
            onClick={() => setShowText(!showText)}
          >
            {showText ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>
      ) : (
        <input className={InputFieldCSS.input} type={type} {...props} />
      )}
    </>
  );
};

export default InputField;
