import Accordion from './Accordion';
import FAQCSS from './FAQ.module.css';

const FAQ = () => {
  return (
    <div className={FAQCSS.container}>
      <Accordion title="What Is This?">
        <p>
          This is a user-friendly way of generating valid cryptocurrency wallets
          using an image (or any file) in addition with an optional password,
          rather than the traditional random number generator. Essentially, the
          wallet seed (24 mnemonic words) is generated from the hash of the file
          and the password.
        </p>
      </Accordion>
      <Accordion title="Why Even Use It?">
        <p>There are several advantages in using a file and a password:</p>
        <ol>
          <li>
            <p>
              1. <strong>Hidden in Plain Sight:</strong> The file can be stored
              on any device or location, and its true value as a cryptocurrency
              wallet is hidden.
            </p>
          </li>
          <li>
            <p>
              2. <strong>Memorability:</strong> It's easier to recall an image
              and a chosen password than to remember a random seed of 24 words.
            </p>
          </li>
          <li>
            <p>
              3. <strong>Versatility Against Threats:</strong> A single file can
              be used to generate multiple wallets by changing the password.
              It's mathematically impossible to determine how many, if any,
              cryptocurrency wallets have been derived from a particular file.
              This provides a safeguard against certain forms of theft attempts,
              like the so-called "$5 wrench attack".
            </p>
          </li>
        </ol>
      </Accordion>
      <Accordion title="What Precautions Should I Take?">
        <ol>
          <li>
            <p>
              1. <strong>File Integrity:</strong> Ensure the file isn't
              compressed after you've used it to generate a wallet. It must
              remain unchanged, byte-for-byte. This is especially crucial for
              images; popular messaging apps tend to compress them, which would
              make them completely different to the wallet generator.
            </p>
          </li>
          <li>
            <p>
              2. <strong>Password Selection:</strong> It's crucial to use a
              password. Phrases, long but memorable, are recommended. For
              example: "My 3.14 dog thinks about 42 :)." Relating the phrase to
              the image can be a useful, but adding random numbers and special
              characters enhance security.
            </p>
          </li>
          <li>
            <p>
              3. <strong>Device Trustworthiness:</strong> Only use this website
              on devices you trust. At present, there isn’t a standalone .html
              version. However, to run it offline, download the GitHub
              repository. For setup, refer to the readme.md and note, icons
              won't display without an internet connection.
            </p>
          </li>
        </ol>
      </Accordion>
      <Accordion title="How Does It Work?">
        <p>
          In simple terms, the selected file is first converted into a data URL
          (a string). If a password is provided, it's appended to the end of
          this string. This combined string is then hashed using sha256. The
          resulting hash serves as the entropy for the wallet generation code,
          which is sourced from{' '}
          <a
            href="https://github.com/iancoleman/bip39"
            target="_blank"
            rel="noreferrer"
          >
            iancoleman bip39
          </a>
          .
        </p>
        <p>
          For advanced users, all generated addresses are made with BIP44:
          m/44'/Coin'/0'/0/Index
        </p>
        <p style={{ margin: '0' }}>
          Entropy = sha256(FileAsDataURL + Password)
        </p>
        <p>MnemonicSeed = getMnemonicFromEntropy(Entropy)</p>
      </Accordion>
      <Accordion title="Is The Code Open-Source?">
        <p>
          Yes. Transparency and the community are essential. If you're
          technically inclined, or just curious, you're welcome to check out the
          source code on{' '}
          <a
            href="https://github.com/AmphibianDev/file-wallet"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>{' '}
          and even contribute. Your insights and improvements are extremely
          valuable. And reviewing the code also allows you to verify its
          legitimacy.
        </p>
      </Accordion>
      <Accordion title="Disclaimer">
        <p>
          Use this website at your own discretion. The developers are not liable
          for any loss of cryptocurrency or other damages. Ensure file integrity
          and only use it on trusted devices. Review the open-source code on{' '}
          <a
            href="https://github.com/AmphibianDev/file-wallet"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>{' '}
          for legitimacy. And always be cautious.
        </p>
      </Accordion>
    </div>
  );
};

export default FAQ;
