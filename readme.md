# File-Wallet: Cryptocurrency Wallet Generator

![showcase.gif](https://github.com/AmphibianDev/file-wallet/assets/110111354/a90eede3-f111-460c-86af-dbe9fbbbb385)

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

It couldn't be any simpler. Just go to [releases](https://github.com/AmphibianDev/file-wallet/releases) and download the file-wallet.html from the latest release. Now, you only need to open it with any browser you like (double click it).

I recommend storing the exact version you used on your PC for safekeeping.

## What still needs to be done

- Add E2E tests using Cypress.
- ~~Make a standalone `.html` file.~~
- ~~Add a loading indicator during wallet generation.~~
- Find a better way to handle the JS code from [iancoleman's bip39](https://github.com/iancoleman/bip39). Maybe worth making an npm package.
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

## Rewards for Contributions

I am grateful to the Tron community for awarding me 4th place at HackaTRON S6. I have allocated $4,000 of the prize as rewards for contributions to the project. Rewards will be distributed in the cryptocurrency of your choice, with amounts determined by the impact of your contribution. Payments will be fairly decided by me, AmphibianDev.

#### Rough Guidelines for Prize Amounts:

- **Minor Bugs:** $50 - $100
- **Major Bugs:** $200 - $500
- **Critical Vulnerabilities:** $1,000 - $3,000
- **Code Improvements and Features:** $100 - $500

**Note**: Don't forget, I am new to everything (GitHub, Git, Web Development, Hackathons, Rewards, etc.) I am learning on the way, please be patient with me. "When you start to walk on the way, the way appears"

## Disclaimer

Use this project at your own risk. The developers are not liable for any loss of cryptocurrency or other damages.
