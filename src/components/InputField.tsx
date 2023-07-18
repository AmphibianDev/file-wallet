import React, { useState } from 'react';

import { Switch } from '@headlessui/react';
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
          <Switch
            className={InputFieldCSS.switchIcon}
            checked={showText}
            onChange={setShowText}
          >
            <span className="sr-only">
              {showText ? 'hide password, switch' : 'show password, switch'}
            </span>
            {showText ? <AiFillEyeInvisible /> : <AiFillEye />}
          </Switch>
        </div>
      ) : (
        <input className={InputFieldCSS.input} type={type} {...props} />
      )}
    </>
  );
};

export default InputField;
