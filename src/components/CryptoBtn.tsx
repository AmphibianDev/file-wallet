import { useState, ButtonHTMLAttributes } from 'react';

import CryptoIcon from './CryptoIcon';
import CryptoListModal from './CryptoListModal';

import CryptoBtnCSS from './CryptoBtn.module.css';

type CryptoBtnProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> & {
  cryptoName: string;
};

const CryptoBtn = ({ cryptoName, ...props }: CryptoBtnProps) => {
  const [cryptoTicker, cryptoFullName] = cryptoName.split(' - ');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <CryptoListModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <button
        {...props}
        className={CryptoBtnCSS.container}
        onClick={() => setIsModalOpen(true)}
      >
        <CryptoIcon
          iconName={cryptoTicker?.toLowerCase() ?? ''}
          resolution="128"
          color="white"
          alwaysVisible={true}
          className={CryptoBtnCSS.image}
        />
        <span className={CryptoBtnCSS.text}>{cryptoFullName}</span>
      </button>
    </>
  );
};

export default CryptoBtn;
