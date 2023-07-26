import { ButtonHTMLAttributes } from 'react';
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
      <img
        className={CryptoBtnCSS.image}
        src={`https://cdn.jsdelivr.net/npm/cryptocurrency-icons/128/white/eth.png`}
        alt={cryptoName}
      />
      <span className={CryptoBtnCSS.text}>{cryptoName}</span>
    </button>
  );
};

export default CryptoBtn;
