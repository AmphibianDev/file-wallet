import { AiFillGithub, AiOutlineTwitter } from 'react-icons/ai';

import FooterCSS from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={FooterCSS.container}>
      <div className={FooterCSS.text}>
        <p>
          Donate <u>Monero</u>:
          <button className={FooterCSS.clickText}>446zMq...kMYfx</button>
        </p>
        <p>
          App version:
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
