# File-Wallet: Cryptocurrency Wallet Generator

Official url: https://file-wallet.com/

This user-friendly website allows you to generate valid cryptocurrency wallets using an image (or any other file) combined with an optional password, rather than the traditional random number generator. Essentially, the wallet seed (24 mnemonic words) is generated from the hash of the file and the password.

## Why Use It?

There are several advantages in using a file and a password:

- **Hidden in Plain Sight:** Your file can be any ordinary image or document that can be stored on any device, disguising its critical role in the wallet creation.
- **Versatility Against Threats:** By changing the password, one file can be the source of multiple wallets. It's virtually impossible to determine how many wallets, if any, originated from a single file. This obscures potential theft attempts, including the so-called "$5 wrench attack".
- **Memorability:** It's easier to recall an image and a chosen password than to remember a randomized 24-word seed.

## How Does It Work?

1. The chosen file is transformed into a data URL (a string representation).
2. If a password is added, it's attached to the end of this string.
3. The concatenated string is hashed using SHA-256, which then becomes the entropy for the wallet generation. The wallet generation code is sourced from [iancoleman's bip39](https://github.com/iancoleman/bip39) and [bip39-coinomi](https://github.com/Coinomi/bip39-coinomi) for Monero.

```javascript
// All generated addresses are made with BIP44:
// `m/44'/Coin'/0'/0/Index`

Entropy = sha256(FileAsDataURL + Password);
MnemonicSeed = getMnemonicFromEntropy(Entropy);
```

## Safety Measures

- **File Integrity:** Ensure the file hasn't been compressed after you've used it to generate a wallet. It must remain unchanged, byte-for-byte. This is especially crucial for images; popular messaging apps tend to compress them, which would make them completely different to the wallet generator.
- **Password Selection:** It's crucial to use a password. Phrases, long but memorable, are recommended. For example: "My 3.14 dog thinks about 42 :)." Relating the phrase to the image can aid recall, but adding at least one random number and a special character is a must.
- **Device Trustworthiness:** Only use this website on devices you trust and preferably offline.
- **QR Code Precaution:** If you use the QR Code, you need to be careful, some scanner devices may store the scan history.

## How to Run It Offline?

Currently, there isn't a standalone .html file, so you'll need to compile it.

1. Go to [releases](https://github.com/AmphibianDev/file-wallet/releases) and download `Source Code (zip)` from the latest version and extract it.
2. Open a terminal within the extracted folder and run those in order:
   1. `npm install`
   2. `npm run preview`
3. Open the localhost link shown in the console.

## What still needs to be done

- Add tests.
- Organize the file structure.
- Make a standalone `.html` file.
- Add a loading indicator during wallet generation.
- Find a better way to handle the JS code from [iancoleman's bip39](https://github.com/iancoleman/bip39).
- ~~Implement a light theme option.~~
- ~~Add Monero support based on [bip39-coinomi](https://github.com/Coinomi/bip39-coinomi).~~
- ~~Enhance accessibility following WAI-ARIA standards.~~

**Task Under Careful Consideration**:

- Use bcrypt instead of SHA-256 for hashing. (_breaking change_)
- Omit the `data:image/png;base64,` prefix from `FileDataUrl`. (_breaking change_)

## Help the Project

If you believe in the idea behind File-Wallet and feel like you can help make it better, please do! Whether it's code improvements, new features, bug reports, or simply feedback, all contributions are valuable.

1. Fork the repository.
2. Create a new branch for your changes.
3. Commit your changes with clear and concise commit messages.
4. Push your branch and open a pull request.
5. Ensure your PR has a description that clearly explains the intention and the changes made.

**Note**: This is my first Website and my first GitHub project. Your patience and constructive feedback are appreciated.

## Disclaimer

Use this project at your own risk. The developers are not liable for any loss of cryptocurrency or other damages.
