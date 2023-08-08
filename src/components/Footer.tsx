import { AiFillGithub, AiOutlineTwitter } from 'react-icons/ai';

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
        <a
          href="https://twitter.com/AmphibianDev"
          target="_blank"
          rel="noreferrer"
        >
          <AiOutlineTwitter />
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
