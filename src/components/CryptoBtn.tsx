import { ButtonHTMLAttributes } from 'react';

import CryptoIcon from './CryptoIcon';

import CryptoBtnCSS from './CryptoBtn.module.css';

type CryptoBtnProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> & {
  cryptoName: string;
};

const CryptoBtn = ({ cryptoName, ...props }: CryptoBtnProps) => {
  return (
    <button {...props} className={CryptoBtnCSS.container}>
      <CryptoIcon
        iconName="eth"
        resolution="128"
        color="white"
        className={CryptoBtnCSS.image}
      />
      <span className={CryptoBtnCSS.text}>{cryptoName}</span>
    </button>
  );
};

export default CryptoBtn;
