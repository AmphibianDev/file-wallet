import { AiFillGithub } from 'react-icons/ai';
import { RiTwitterXLine } from 'react-icons/ri';

import MiddleTruncate from './MiddleTruncate';

import useInfoPopupStore from './InfoPopup.store';

import FooterCSS from './Footer.module.css';

const Footer = () => {
  const { openPopup } = useInfoPopupStore();

  const myMoneroAddress =
    '49FuwMjQZBHjnvdpk2hxYWNy !! THIS IS A PLACE HOLDER !! YsbSPETdfPubVoZQcbPpgPPbN3QqamV4';

  const handleCopy = () => {
    navigator.clipboard
      .writeText(myMoneroAddress)
      .then(() => {
        openPopup('copied', 'success', 1000);
      })
      .catch(error => {
        console.error('Failed to copy text: ', error);
        openPopup('failed to copy', 'error', 1000);
      });
  };

  return (
    <footer className={FooterCSS.container}>
      <div className={FooterCSS.text}>
        <p>
          Donate <u>Monero</u>:{' '}
          <button className={FooterCSS.clickText} onClick={handleCopy}>
            <MiddleTruncate minChars={7} maxChars={7} text={myMoneroAddress} />
          </button>
        </p>
        <p>
          App Version:{' '}
          <a
            href="https://github.com/AmphibianDev/file-wallet"
            target="_blank"
            rel="noreferrer"
            className={FooterCSS.clickText}
          >
            0.1.1V
          </a>
        </p>
      </div>
      <div className={FooterCSS.icons}>
        <a href="https://x.com/AmphibianDev" target="_blank" rel="noreferrer">
          <RiTwitterXLine />
        </a>
        <a
          href="https://github.com/AmphibianDev/file-wallet"
          target="_blank"
          rel="noreferrer"
        >
          <AiFillGithub />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
