import Accordion from './Accordion';
import FAQCSS from './FAQ.module.css';

const FAQ = () => {
  return (
    <div className={FAQCSS.container}>
      <Accordion title="What Is This?">
        <p>
          This user-friendly website allows you to generate valid cryptocurrency
          wallets using an image (or any other file) combined with an optional
          password, rather than the traditional random number generator.
          Essentially, the wallet seed (24 mnemonic words) is generated from the
          hash of the file and the password.
        </p>
      </Accordion>
      <Accordion title="Why Use It?">
        <p>There are several advantages in using a file and a password:</p>
        <ol>
          <li>
            <p>
              1. <strong>Hidden in Plain Sight:</strong> Your file can be any
              ordinary image or document that can be stored on any device,
              disguising its critical role in the wallet creation.
            </p>
          </li>
          <li>
            <p>
              2. <strong>Versatility Against Threats:</strong> By changing the
              password, one file can be the source of multiple wallets. It's
              virtually impossible to determine how many wallets, if any,
              originated from a single file. This obscures potential theft
              attempts, including the so-called "$5 wrench attack".
            </p>
          </li>
          <li>
            <p>
              3. <strong>Memorability:</strong> It's easier to recall an image
              and a chosen password than to remember a randomized 24-word seed.
            </p>
          </li>
        </ol>
      </Accordion>
      <Accordion title="How Does It Work?">
        <ol>
          <li>
            <p>
              1. The chosen file is transformed into a data URL (a string
              representation).
            </p>
          </li>
          <li>
            <p>
              2. If a password is added, it's attached to the end of this
              string.
            </p>
          </li>
          <li>
            <p>
              3. The concatenated string is hashed using SHA-256, which then
              becomes the entropy for the wallet generation. The wallet
              generation code is sourced from{' '}
              <a
                href="https://github.com/iancoleman/bip39"
                target="_blank"
                rel="noreferrer"
              >
                iancoleman bip39
              </a>{' '}
              and{' '}
              <a
                href="https://github.com/Coinomi/bip39-coinomi"
                target="_blank"
                rel="noreferrer"
              >
                bip39-coinomi
              </a>{' '}
              for Monero.
            </p>
          </li>
        </ol>
        <br />
        <code>
          // All generated addresses are made with BIP44: m/44'/Coin'/0'/0/Index
          <br />
          Entropy = sha256(FileAsDataURL + Password)
          <br />
          MnemonicSeed = getMnemonicFromEntropy(Entropy){' '}
        </code>
      </Accordion>
      <Accordion title="How to Stay Safe?">
        <ol>
          <li>
            <p>
              1. <strong>File Integrity:</strong> Ensure the file hasn't been
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
              the image can aid recall, but adding at least one random number
              and a special character is a must.
            </p>
          </li>
          <li>
            <p>
              3. <strong>Device Trustworthiness:</strong> Only use this website
              on devices you trust and preferably offline.
            </p>
          </li>
          <li>
            <p>
              4. <strong>QR Code Precaution:</strong> If you use the QR Code,
              you need to be careful, some scanner devices may store the scan
              history.
            </p>
          </li>
        </ol>
      </Accordion>
      <Accordion title="How to Run It Offline?">
        <p>
          Currently, there isn't a standalone .html file, so you'll need to
          compile it.
        </p>
        <ol>
          <li>
            1. Go to{' '}
            <a href="https://github.com/AmphibianDev/file-wallet/releases">
              releases
            </a>{' '}
            and download <code>Source Code (zip)</code> from the latest version
            and extract it.
          </li>
          <li>
            2. Open a terminal within the extracted folder and run those in
            order:
            <ol style={{ marginLeft: '2rem' }}>
              <li>
                1. <code>npm install</code>
              </li>
              <li>
                2. <code>npm run build</code>
              </li>
              <li>
                3. <code>npm run preview</code>
              </li>
            </ol>
          </li>
          <li>3. Open the localhost link shown in the console.</li>
        </ol>
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
          Use this project at your own risk. The developers are not liable for
          any loss of cryptocurrency or other damages. Ensure file integrity and
          only use it on trusted devices. Review the open-source code on{' '}
          <a
            href="https://github.com/AmphibianDev/file-wallet"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          . And remember the website is still in the alpha stage.
        </p>
      </Accordion>
    </div>
  );
};

// eslint-disable-next-line
export default FAQ;
