import { AiFillGithub } from 'react-icons/ai';

import MiddleTruncate from './MiddleTruncate';

import FooterCSS from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={FooterCSS.container}>
      <div className={FooterCSS.text}>
        <p>
          Donate <u>Monero</u>:{' '}
          <button className={FooterCSS.clickText}>
            <MiddleTruncate
              minChars={7}
              maxChars={7}
              text="49FuwMjQZBHjnvdpk2hxYWNyufQ9Js5RrAwqq6qs8muaZima8iZzQuuC3jNfjCcYsbSPETdfPubVoZQcbPpgPPbN3QqamV4"
            />
          </button>
        </p>
        <p>
          App Version:{' '}
          <a href="" className={FooterCSS.clickText}>
            0.1.1V
          </a>
        </p>
      </div>
      <div className={FooterCSS.icons}>
        <a href="https://x.com/AmphibianDev" target="_blank" rel="noreferrer">
          {/* Taken from 𝕏 directly until is available on react-icons*/}
          <svg viewBox="0 0 24 24">
            <g>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </g>
          </svg>
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
