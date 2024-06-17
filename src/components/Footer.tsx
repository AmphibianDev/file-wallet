import { AiFillGithub } from 'react-icons/ai';
import { RiTwitterXLine } from 'react-icons/ri';

import MiddleTruncate from './MiddleTruncate';

import useInfoPopupStore from './InfoPopup.store';

import FooterCSS from './Footer.module.css';

const Footer = () => {
  const { openPopup } = useInfoPopupStore();

  const myMoneroAddress =
    '83PVCBCyANzZzBjNtpCkM6bT88DBY5icMNZycyJm93QzLoizCwGvd8zM7ShMNhUac82QQFeAx1TCbh9Ljff423U1Tt585qs';

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
          <button
            className={FooterCSS.clickText}
            onClick={handleCopy}
            aria-label="Copy my Monero address for donation"
          >
            <MiddleTruncate minChars={7} maxChars={7} text={myMoneroAddress} />
          </button>
        </p>
        <p>
          App Version:{' '}
          <a
            href="https://github.com/AmphibianDev/file-wallet/releases"
            target="_blank"
            rel="noopener external"
            className={FooterCSS.clickText}
            aria-label="GitHub latest release"
          >
            v0.6.0-alpha
          </a>
        </p>
      </div>
      <div className={FooterCSS.icons}>
        <a
          href="https://x.com/AmphibianDev"
          target="_blank"
          rel="noopener external"
          aria-label="X Social Page"
        >
          <RiTwitterXLine />
        </a>
        <a
          href="https://github.com/AmphibianDev/file-wallet"
          target="_blank"
          rel="noreferrer"
          aria-label="Github Repository"
        >
          <AiFillGithub />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
