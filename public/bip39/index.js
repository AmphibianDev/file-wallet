const topOrder = [
  'BTC - Bitcoin',
  'XMR - Monero',
  'ETH - Ethereum',
  'TRX - Tron',
  'BTT - BitTorrent',
  'XRP - Ripple',
  'DOGE - Dogecoin',
  'LTC - Litecoin',
  'ATOM - Cosmos Hub',
  'ETC - Ethereum Classic',
  'XLM - Stellar',
  'BCH - Bitcoin Cash',
  'VET - VeChain',
  'EOS - EOSIO',
  'BSV - BitcoinSV',
  'ZEC - Zcash',
  'DASH - Dash',
  'RUNE - THORChain',
  'RVN - Ravencoin',
  'BSC - Binance Smart Chain',
];

// Global variables
var mnemonics = { english: new Mnemonic('english') };
var mnemonic = mnemonics['english'];
var xmrMnemonic = '';
var seed = null;
var bip32RootKey = null;
var bip32ExtendedKey = null;
var network = libs.bitcoin.networks.bitcoin;

var globalPhrase = null;

var cryptoIndex = 20;
const globalPurpose = 44;
var globalCoin = 0;
var globalAccount = 0;
var globalChange = 0;

function setCrypto(cryptoName) {
  // old name: setNetwork()

  let index = networks.findIndex(obj => obj.name === cryptoName);
  if (index === -1) {
    console.log('Network not found');
    return false;
  }

  cryptoIndex = index;
  networks[cryptoIndex].onSelect();
  return true;
}

async function sha256(str) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(str);

  // hash it
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

function getMnemonicFromEntropy(entropyStr) {
  // old name: setMnemonicFromEntropy()

  // Work out minimum base for entropy
  var entropy = Entropy.fromString(entropyStr);
  if (entropy.binaryStr.length == 0) {
    return;
  }
  var bits = entropy.binaryStr;
  // Discard trailing entropy
  var bitsToUse = Math.floor(bits.length / 32) * 32;
  var start = bits.length - bitsToUse;
  var binaryStr = bits.substring(start);
  // Convert entropy string to numeric array
  var entropyArr = [];
  for (var i = 0; i < binaryStr.length / 8; i++) {
    var byteAsBits = binaryStr.substring(i * 8, i * 8 + 8);
    var entropyByte = parseInt(byteAsBits, 2);
    entropyArr.push(entropyByte);
  }
  // Convert entropy array to mnemonic
  return mnemonic.toMnemonic(entropyArr);
}

function generateFromMnemonic(mnemonicString, numberOfWallets = 10) {
  // old name: phraseChanged()

  const out = {
    errorMessage: '',
    bip39Mnemonic: mnemonicString,
    xmrMnemonic: '',
    entropy: mnemonic.toRawEntropyHex(mnemonicString),
    bip39Seed: '',
    bip32RootKey: '',
    accountExtendedPrvKey: '',
    accountExtendedPubKey: '',
    derivationPath: '',
    wallets: [],
  };

  globalPhrase = mnemonicString;

  setMnemonicLanguage();
  var errorText = findPhraseErrors(mnemonicString);
  if (errorText) {
    out.errorMessage = errorText;
    return out;
  }

  const passphrase = '';
  calcBip32RootKeyFromSeed(mnemonicString, passphrase);
  out.bip39Seed = seed;
  out.bip32RootKey = bip32RootKey.toBase58();

  calcForDerivationPath();
  var path = `m/${globalPurpose}'/${globalCoin}'/${globalAccount}'/`;
  var accountExtendedKey = calcBip32ExtendedKey(path);
  out.accountExtendedPrvKey = accountExtendedKey.toBase58();
  out.accountExtendedPubKey = accountExtendedKey.neutered().toBase58();

  out.derivationPath = getDerivationPath();

  xmrMnemonic = '';
  for (let i = 0; i < numberOfWallets; i++) {
    out.wallets.push(generateKeysAtIndex(i, false));
  }
  out.xmrMnemonic = xmrMnemonic;

  return out;
}

// ---------------------  ---------------------

function generateKeysAtIndex(index, useHardenedAddresses = false) {
  // old name: calculateValues()

  // derive HDkey for this row of the table
  var key = 'NA';
  if (networks[cryptoIndex].name == 'XMR - Monero') {
    if (useHardenedAddresses) {
      key = bip32ExtendedKey.deriveHardened(0);
    } else {
      key = bip32ExtendedKey.derive(0);
    }
  } else {
    if (useHardenedAddresses) {
      key = bip32ExtendedKey.deriveHardened(index);
    } else {
      key = bip32ExtendedKey.derive(index);
    }
  }

  var keyPair = key.keyPair;
  // get address
  var address = keyPair.getAddress().toString();
  // get privkey
  var hasPrivkey = !key.isNeutered();
  var privkey = 'NA';
  if (hasPrivkey) {
    privkey = keyPair.toWIF();
  }
  // get pubkey
  var pubkey = keyPair.getPublicKeyBuffer().toString('hex');
  var indexText = getDerivationPath() + '/' + index;
  if (useHardenedAddresses) {
    indexText = indexText + "'";
  }
  // Ethereum values are different
  if (networkIsEthereum()) {
    var pubkeyBuffer = keyPair.getPublicKeyBuffer();
    var ethPubkey = libs.ethUtil.importPublic(pubkeyBuffer);
    var addressBuffer = libs.ethUtil.publicToAddress(ethPubkey);
    var hexAddress = addressBuffer.toString('hex');
    var checksumAddress = libs.ethUtil.toChecksumAddress(hexAddress);
    address = libs.ethUtil.addHexPrefix(checksumAddress);
    pubkey = libs.ethUtil.addHexPrefix(pubkey);
    if (hasPrivkey) {
      privkey = libs.ethUtil.bufferToHex(keyPair.d.toBuffer(32));
    }

    // Remove the 0x from the public and private key
    if (networks[cryptoIndex].name === 'BTT - BitTorrent') {
      pubkey = pubkey.slice(2);
      privkey = privkey.slice(2);
    }
  }
  //TRX is different
  if (networks[cryptoIndex].name == 'TRX - Tron') {
    keyPair = new libs.bitcoin.ECPair(keyPair.d, null, {
      network: network,
      compressed: false,
    });
    var pubkeyBuffer = keyPair.getPublicKeyBuffer();
    var ethPubkey = libs.ethUtil.importPublic(pubkeyBuffer);
    var addressBuffer = libs.ethUtil.publicToAddress(ethPubkey);
    address = libs.bitcoin.address.toBase58Check(addressBuffer, 0x41);
    if (hasPrivkey) {
      privkey = keyPair.d.toBuffer().toString('hex');
    }
  }

  // RSK values are different
  if (networkIsRsk()) {
    var pubkeyBuffer = keyPair.getPublicKeyBuffer();
    var ethPubkey = libs.ethUtil.importPublic(pubkeyBuffer);
    var addressBuffer = libs.ethUtil.publicToAddress(ethPubkey);
    var hexAddress = addressBuffer.toString('hex');
    // Use chainId based on selected network
    // Ref: https://developers.rsk.co/rsk/architecture/account-based/#chainid
    var chainId;
    var rskNetworkName = networks[cryptoIndex].name;
    switch (rskNetworkName) {
      case 'R-BTC - RSK':
        chainId = 30;
        break;
      case 'tR-BTC - RSK Testnet':
        chainId = 31;
        break;
      default:
        chainId = null;
    }
    var checksumAddress = toChecksumAddressForRsk(hexAddress, chainId);
    address = libs.ethUtil.addHexPrefix(checksumAddress);
    pubkey = libs.ethUtil.addHexPrefix(pubkey);
    if (hasPrivkey) {
      privkey = libs.ethUtil.bufferToHex(keyPair.d.toBuffer());
    }
  }

  // Handshake values are different
  if (networks[cryptoIndex].name == 'HNS - Handshake') {
    var ring = libs.handshake.KeyRing.fromPublic(keyPair.getPublicKeyBuffer());
    address = ring.getAddress().toString();
  }

  // Stellar is different
  if (networks[cryptoIndex].name == 'XLM - Stellar') {
    var purpose = globalPurpose;
    var coin = globalCoin;
    var path = 'm/';
    path += purpose + "'/";
    path += coin + "'/" + index + "'";
    var keypair = libs.stellarUtil.getKeypair(path, seed);
    indexText = path;
    privkey = keypair.secret();
    pubkey = address = keypair.publicKey();
  }

  // Nano currency
  if (networks[cryptoIndex].name == 'NANO - Nano') {
    var nanoKeypair = libs.nanoUtil.getKeypair(index, seed);
    privkey = nanoKeypair.privKey;
    pubkey = nanoKeypair.pubKey;
    address = nanoKeypair.address;
  }

  if (networks[cryptoIndex].name == 'NAS - Nebulas') {
    var privKeyBuffer = keyPair.d.toBuffer(32);
    var nebulasAccount = libs.nebulas.Account.NewAccount();
    nebulasAccount.setPrivateKey(privKeyBuffer);
    address = nebulasAccount.getAddressString();
    privkey = nebulasAccount.getPrivateKeyString();
    pubkey = nebulasAccount.getPublicKeyString();
  }
  // Ripple values are different
  if (networks[cryptoIndex].name == 'XRP - Ripple') {
    privkey = convertRipplePriv(privkey);
    address = convertRippleAdrr(address);
  }
  // Jingtum values are different
  if (networks[cryptoIndex].name == 'SWTC - Jingtum') {
    privkey = convertJingtumPriv(privkey);
    address = convertJingtumAdrr(address);
  }
  // CasinoCoin values are different
  if (networks[cryptoIndex].name == 'CSC - CasinoCoin') {
    privkey = convertCasinoCoinPriv(privkey);
    address = convertCasinoCoinAdrr(address);
  }
  // Bitcoin Cash address format may vary
  if (networks[cryptoIndex].name == 'BCH - Bitcoin Cash') {
    var bchAddrType = 'bitpay'; //My TODO: add a method to choose.
    if (bchAddrType == 'cashaddr') {
      address = libs.bchaddr.toCashAddress(address);
    } else if (bchAddrType == 'bitpay') {
      address = libs.bchaddr.toBitpayAddress(address);
    }
  }
  // Bitcoin Cash address format may vary
  if (networks[cryptoIndex].name == 'SLP - Simple Ledger Protocol') {
    var bchAddrType = 'cashaddr'; //My TODO: add a method to choose.
    if (bchAddrType == 'cashaddr') {
      address = libs.bchaddrSlp.toSlpAddress(address);
    }
  }

  // ZooBC address format may vary
  if (networks[cryptoIndex].name == 'ZBC - ZooBlockchain') {
    var purpose = globalPurpose;
    var coin = globalCoin;
    var path = 'm/';
    path += purpose + "'/";
    path += coin + "'/" + index + "'";
    var result = libs.zoobcUtil.getKeypair(path, seed);

    let publicKey = result.pubKey.slice(1, 33);
    let privateKey = result.key;

    privkey = privateKey.toString('hex');
    pubkey = publicKey.toString('hex');

    indexText = path;
    address = libs.zoobcUtil.getZBCAddress(publicKey, 'ZBC');
  }

  if (networks[cryptoIndex].name == 'CRW - Crown') {
    address = libs.bitcoin.networks.crown.toNewAddress(address);
  }

  if (networks[cryptoIndex].name == 'EOS - EOSIO') {
    address = '';
    pubkey = EOSbufferToPublic(keyPair.getPublicKeyBuffer());
    privkey = EOSbufferToPrivate(keyPair.d.toBuffer(32));
  }

  if (
    networks[cryptoIndex].name == 'FIO - Foundation for Interwallet Operability'
  ) {
    address = '';
    pubkey = FIObufferToPublic(keyPair.getPublicKeyBuffer());
    privkey = FIObufferToPrivate(keyPair.d.toBuffer(32));
  }

  if (networks[cryptoIndex].name == 'ATOM - Cosmos Hub') {
    const hrp = 'cosmos';
    address = CosmosBufferToAddress(keyPair.getPublicKeyBuffer(), hrp);
    pubkey = CosmosBufferToPublic(keyPair.getPublicKeyBuffer(), hrp);
    privkey = keyPair.d.toBuffer().toString('base64');
  }

  if (networks[cryptoIndex].name == 'RUNE - THORChain') {
    const hrp = 'thor';
    address = CosmosBufferToAddress(keyPair.getPublicKeyBuffer(), hrp);
    pubkey = keyPair.getPublicKeyBuffer().toString('hex');
    privkey = keyPair.d.toBuffer().toString('hex');
  }

  if (networks[cryptoIndex].name == 'XWC - Whitecoin') {
    address = XWCbufferToAddress(keyPair.getPublicKeyBuffer());
    pubkey = XWCbufferToPublic(keyPair.getPublicKeyBuffer());
    privkey = XWCbufferToPrivate(keyPair.d.toBuffer(32));
  }

  if (networks[cryptoIndex].name == 'LUNA - Terra') {
    const hrp = 'terra';
    address = CosmosBufferToAddress(keyPair.getPublicKeyBuffer(), hrp);
    pubkey = keyPair.getPublicKeyBuffer().toString('hex');
    privkey = keyPair.d.toBuffer().toString('hex');
  }

  if (networks[cryptoIndex].name == 'IOV - Starname') {
    const hrp = 'star';
    address = CosmosBufferToAddress(keyPair.getPublicKeyBuffer(), hrp);
    pubkey = CosmosBufferToPublic(keyPair.getPublicKeyBuffer(), hrp);
    privkey = keyPair.d.toBuffer().toString('base64');
  }

  if (networks[cryptoIndex].name == 'XMR - Monero') {
    var rawPrivateKey = keyPair.d.toBuffer(32);

    // Hashing with keccak256 from js-sha3 / sha3.js
    // keccak256 (not sha3) same as bip39-coinomi "sha3"
    var hashHex = keccak256(rawPrivateKey);

    // Convert hex string to Uint8Array
    var rawSecretSpendKey = new Uint8Array(
      hashHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
    );

    var secretSpendKey = XMRModule.lib.sc_reduce32(rawSecretSpendKey);
    var secretViewKey = XMRModule.lib.hash_to_scalar(secretSpendKey);
    var publicSpendKey = XMRModule.lib.secret_key_to_public_key(secretSpendKey);
    var publicViewKey = XMRModule.lib.secret_key_to_public_key(secretViewKey);

    if (index == 0) {
      publicSpendKey = XMRModule.lib.secret_key_to_public_key(secretSpendKey);
      publicViewKey = XMRModule.lib.secret_key_to_public_key(secretViewKey);

      xmrMnemonic = XMRModule.lib.secret_spend_key_to_words(secretSpendKey);
    } else {
      var m = XMRModule.lib.get_subaddress_secret_key(secretViewKey, 0, index);
      secretSpendKey = XMRModule.lib.sc_add(m, secretSpendKey);
      publicSpendKey = XMRModule.lib.secret_key_to_public_key(secretSpendKey);
      publicViewKey = XMRModule.lib.scalarmultKey(
        publicSpendKey,
        secretViewKey
      );
    }

    // secretSpendKey
    privkey = uint8ArrayToHex(secretSpendKey);

    // secretViewKey
    pubkey = uint8ArrayToHex(secretViewKey);

    address = XMRModule.lib.pub_keys_to_address(
      XMRModule.lib.MONERO_MAINNET,
      index != 0,
      publicSpendKey,
      publicViewKey
    );
  }

  return { derivationPath: indexText, address, privkey, pubkey };
}

function calcBip32RootKeyFromSeed(phrase, passphrase) {
  seed = mnemonic.toSeed(phrase, passphrase);
  bip32RootKey = libs.bitcoin.HDNode.fromSeedHex(seed, network);
  if (isGRS())
    bip32RootKey = libs.groestlcoinjs.HDNode.fromSeedHex(seed, network);
}

function calcForDerivationPath() {
  // Get the derivation path
  var derivationPath = getDerivationPath();
  var errorText = findDerivationPathErrors(derivationPath);
  if (errorText) {
    return;
  }
  bip32ExtendedKey = calcBip32ExtendedKey(derivationPath);
}

function getDerivationPath() {
  return `m/${globalPurpose}'/${globalCoin}'/${globalAccount}'/${globalChange}`;
}

function findDerivationPathErrors(path) {
  // TODO is not perfect but is better than nothing
  // Inspired by
  // https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#test-vectors
  // and
  // https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#extended-keys
  var maxDepth = 255; // TODO verify this!!
  var maxIndexValue = Math.pow(2, 31); // TODO verify this!!
  if (path[0] != 'm') {
    return "First character must be 'm'";
  }
  if (path.length > 1) {
    if (path[1] != '/') {
      return "Separator must be '/'";
    }
    var indexes = path.split('/');
    if (indexes.length > maxDepth) {
      return (
        'Derivation depth is ' +
        indexes.length +
        ', must be less than ' +
        maxDepth
      );
    }
    for (var depth = 1; depth < indexes.length; depth++) {
      var index = indexes[depth];
      var invalidChars = index.replace(/^[0-9]+'?$/g, '');
      if (invalidChars.length > 0) {
        return (
          'Invalid characters ' + invalidChars + ' found at depth ' + depth
        );
      }
      var indexValue = parseInt(index.replace("'", ''));
      if (isNaN(depth)) {
        return 'Invalid number at depth ' + depth;
      }
      if (indexValue > maxIndexValue) {
        return (
          'Value of ' +
          indexValue +
          ' at depth ' +
          depth +
          ' must be less than ' +
          maxIndexValue
        );
      }
    }
  }
  // Check root key exists or else derivation path is useless!
  if (!bip32RootKey) {
    return 'No root key';
  }
  // Check no hardened derivation path when using xpub keys
  var hardenedPath = path.indexOf("'") > -1;
  var isXpubkey = bip32RootKey.isNeutered();
  if (hardenedPath && isXpubkey) {
    return 'Hardened derivation path is invalid with xpub key';
  }
  return false;
}

function calcBip32ExtendedKey(path) {
  // Check there's a root key to derive from
  if (!bip32RootKey) {
    return bip32RootKey;
  }
  var extendedKey = bip32RootKey;
  // Derive the key from the path
  var pathBits = path.split('/');
  for (var i = 0; i < pathBits.length; i++) {
    var bit = pathBits[i];
    var index = parseInt(bit);
    if (isNaN(index)) {
      continue;
    }
    var hardened = bit[bit.length - 1] == "'";
    var isPriv = !extendedKey.isNeutered();
    var invalidDerivationPath = hardened && !isPriv;
    if (invalidDerivationPath) {
      extendedKey = null;
    } else if (hardened) {
      extendedKey = extendedKey.deriveHardened(index);
    } else {
      extendedKey = extendedKey.derive(index);
    }
  }
  return extendedKey;
}

function setMnemonicLanguage() {
  var language = getLanguage();
  // Load the bip39 mnemonic generator for this language if required
  if (!(language in mnemonics)) {
    mnemonics[language] = new Mnemonic(language);
  }
  mnemonic = mnemonics[language];
}

function findPhraseErrors(phrase) {
  // Preprocess the words
  phrase = mnemonic.normalizeString(phrase);
  var words = phraseToWordArray(phrase);
  // Detect blank phrase
  if (words.length == 0) {
    return 'Blank mnemonic';
  }
  // Check each word
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    var language = getLanguage();
    if (WORDLISTS[language].indexOf(word) == -1) {
      console.log('Finding closest match to ' + word);
      var nearestWord = findNearestWord(word);
      return word + ' not in wordlist, did you mean ' + nearestWord + '?';
    }
  }
  // Check the words are valid
  var properPhrase = wordArrayToPhrase(words);
  var isValid = mnemonic.check(properPhrase);
  if (!isValid) {
    return 'Invalid mnemonic';
  }
  return false;
}

function findNearestWord(word) {
  var language = getLanguage();
  var words = WORDLISTS[language];
  var minDistance = 99;
  var closestWord = words[0];
  for (var i = 0; i < words.length; i++) {
    var comparedTo = words[i];
    if (comparedTo.indexOf(word) == 0) {
      return comparedTo;
    }
    var distance = libs.levenshtein.get(word, comparedTo);
    if (distance < minDistance) {
      closestWord = comparedTo;
      minDistance = distance;
    }
  }
  return closestWord;
}

function wordArrayToPhrase(words) {
  var phrase = words.join(' ');
  var language = getLanguageFromPhrase(phrase);
  if (language == 'japanese') {
    phrase = words.join('\u3000');
  }
  return phrase;
}

function getLanguage() {
  var defaultLanguage = 'english';
  // Try to get from existing phrase
  var language = getLanguageFromPhrase();
  // Default to English if no other option
  if (language.length == 0) {
    language = defaultLanguage;
  }
  return language;
}

function getLanguageFromPhrase(phrase) {
  // Check if how many words from existing phrase match a language.
  var language = '';
  if (!phrase) {
    phrase = globalPhrase;
  }
  if (phrase.length > 0) {
    var words = phraseToWordArray(phrase);
    var languageMatches = {};
    for (l in WORDLISTS) {
      // Track how many words match in this language
      languageMatches[l] = 0;
      for (var i = 0; i < words.length; i++) {
        var wordInLanguage = WORDLISTS[l].indexOf(words[i]) > -1;
        if (wordInLanguage) {
          languageMatches[l]++;
        }
      }
      // Find languages with most word matches.
      // This is made difficult due to commonalities between Chinese
      // simplified vs traditional.
      var mostMatches = 0;
      var mostMatchedLanguages = [];
      for (var l in languageMatches) {
        var numMatches = languageMatches[l];
        if (numMatches > mostMatches) {
          mostMatches = numMatches;
          mostMatchedLanguages = [l];
        } else if (numMatches == mostMatches) {
          mostMatchedLanguages.push(l);
        }
      }
    }
    if (mostMatchedLanguages.length > 0) {
      // Use first language and warn if multiple detected
      language = mostMatchedLanguages[0];
      if (mostMatchedLanguages.length > 1) {
        console.warn('Multiple possible languages');
        console.warn(mostMatchedLanguages);
      }
    }
  }
  return language;
}

function phraseToWordArray(phrase) {
  var words = phrase.split(/\s/g);
  var noBlanks = [];
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    if (word.length > 0) {
      noBlanks.push(word);
    }
  }
  return noBlanks;
}

function uint8ArrayToHex(a) {
  var s = '';
  for (var i = 0; i < a.length; i++) {
    var h = a[i].toString(16);
    while (h.length < 2) {
      h = '0' + h;
    }
    s = s + h;
  }
  return s;
}

function isGRS() {
  return (
    networks[cryptoIndex].name == 'GRS - Groestlcoin' ||
    networks[cryptoIndex].name == 'GRS - Groestlcoin Testnet'
  );
}

function networkIsEthereum() {
  var name = networks[cryptoIndex].name;
  return (
    name == 'ETH - Ethereum' ||
    name == 'BTT - BitTorrent' ||
    name == 'ETC - Ethereum Classic' ||
    name == 'EWT - EnergyWeb' ||
    name == 'PIRL - Pirl' ||
    name == 'MIX - MIX' ||
    name == 'MOAC - MOAC' ||
    name == 'MUSIC - Musicoin' ||
    name == 'POA - Poa' ||
    name == 'EXP - Expanse' ||
    name == 'CLO - Callisto' ||
    name == 'DXN - DEXON' ||
    name == 'ELLA - Ellaism' ||
    name == 'ESN - Ethersocial Network' ||
    name == 'VET - VeChain' ||
    name == 'ERE - EtherCore' ||
    name == 'BSC - Binance Smart Chain'
  );
}

function networkIsRsk() {
  var name = networks[cryptoIndex].name;
  return name == 'R-BTC - RSK' || name == 'tR-BTC - RSK Testnet';
}

function toChecksumAddressForRsk(address, chainId = null) {
  if (typeof address !== 'string') {
    throw new Error('address parameter should be a string.');
  }

  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    throw new Error('Given address is not a valid RSK address: ' + address);
  }

  var stripAddress = stripHexPrefix(address).toLowerCase();
  var prefix = chainId != null ? chainId.toString() + '0x' : '';
  var keccakHash = libs.ethUtil
    .keccak256(prefix + stripAddress)
    .toString('hex')
    .replace(/^0x/i, '');
  var checksumAddress = '0x';

  for (var i = 0; i < stripAddress.length; i++) {
    checksumAddress +=
      parseInt(keccakHash[i], 16) >= 8
        ? stripAddress[i].toUpperCase()
        : stripAddress[i];
  }

  return checksumAddress;
}

var networks = [
  {
    name: 'AC - Asiacoin',
    onSelect: function () {
      network = libs.bitcoin.networks.asiacoin;
      setHdCoin(51);
    },
  },
  {
    name: 'ACC - Adcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.adcoin;
      setHdCoin(161);
    },
  },
  {
    name: 'AGM - Argoneum',
    onSelect: function () {
      network = libs.bitcoin.networks.argoneum;
      setHdCoin(421);
    },
  },
  {
    name: 'ARYA - Aryacoin',
    onSelect: function () {
      network = libs.bitcoin.networks.aryacoin;
      setHdCoin(357);
    },
  },
  {
    name: 'ATOM - Cosmos Hub',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(118);
    },
  },
  {
    name: 'AUR - Auroracoin',
    onSelect: function () {
      network = libs.bitcoin.networks.auroracoin;
      setHdCoin(85);
    },
  },
  {
    name: 'AXE - Axe',
    onSelect: function () {
      network = libs.bitcoin.networks.axe;
      setHdCoin(4242);
    },
  },
  {
    name: 'ANON - ANON',
    onSelect: function () {
      network = libs.bitcoin.networks.anon;
      setHdCoin(220);
    },
  },
  {
    name: 'BOLI - Bolivarcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.bolivarcoin;
      setHdCoin(278);
    },
  },
  {
    name: 'BCA - Bitcoin Atom',
    onSelect: function () {
      network = libs.bitcoin.networks.atom;
      setHdCoin(185);
    },
  },
  {
    name: 'BCH - Bitcoin Cash',
    onSelect: function () {
      // DOM.bitcoinCashAddressTypeContainer.removeClass('hidden');
      setHdCoin(145);
    },
  },
  {
    name: 'BEET - Beetlecoin',
    onSelect: function () {
      network = libs.bitcoin.networks.beetlecoin;
      setHdCoin(800);
    },
  },
  {
    name: 'BELA - Belacoin',
    onSelect: function () {
      network = libs.bitcoin.networks.belacoin;
      setHdCoin(73);
    },
  },
  {
    name: 'BLK - BlackCoin',
    onSelect: function () {
      network = libs.bitcoin.networks.blackcoin;
      setHdCoin(10);
    },
  },
  {
    name: 'BND - Blocknode',
    onSelect: function () {
      network = libs.bitcoin.networks.blocknode;
      setHdCoin(2941);
    },
  },
  {
    name: 'tBND - Blocknode Testnet',
    onSelect: function () {
      network = libs.bitcoin.networks.blocknode_testnet;
      setHdCoin(1);
    },
  },
  {
    name: 'BRIT - Britcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.britcoin;
      setHdCoin(70);
    },
  },
  {
    name: 'BSD - Bitsend',
    onSelect: function () {
      network = libs.bitcoin.networks.bitsend;
      setHdCoin(91);
    },
  },
  {
    name: 'BST - BlockStamp',
    onSelect: function () {
      network = libs.bitcoin.networks.blockstamp;
      setHdCoin(254);
    },
  },
  {
    name: 'BTA - Bata',
    onSelect: function () {
      network = libs.bitcoin.networks.bata;
      setHdCoin(89);
    },
  },
  {
    name: 'BTC - Bitcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(0);
    },
  },
  {
    name: 'BTC - Bitcoin RegTest',
    onSelect: function () {
      network = libs.bitcoin.networks.regtest;
      // Using hd coin value 1 based on bip44_coin_type
      // https://github.com/chaintope/bitcoinrb/blob/f1014406f6b8f9b4edcecedc18df70c80df06f11/lib/bitcoin/chainparams/regtest.yml
      setHdCoin(1);
    },
  },
  {
    name: 'BTC - Bitcoin Testnet',
    onSelect: function () {
      network = libs.bitcoin.networks.testnet;
      setHdCoin(1);
    },
  },
  {
    name: 'BITG - Bitcoin Green',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoingreen;
      setHdCoin(222);
    },
  },
  {
    name: 'BTCP - Bitcoin Private',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoinprivate;
      setHdCoin(183);
    },
  },
  {
    name: 'BTCPt - Bitcoin Private Testnet',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoinprivatetestnet;
      setHdCoin(1);
    },
  },
  {
    name: 'BSC - Binance Smart Chain',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(60);
    },
  },
  {
    name: 'BSV - BitcoinSV',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoinsv;
      setHdCoin(236);
    },
  },
  {
    name: 'BTCZ - Bitcoinz',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoinz;
      setHdCoin(177);
    },
  },
  {
    name: 'BTDX - BitCloud',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcloud;
      setHdCoin(218);
    },
  },
  {
    name: 'BTG - Bitcoin Gold',
    onSelect: function () {
      network = libs.bitcoin.networks.bgold;
      setHdCoin(156);
    },
  },
  {
    name: 'BTX - Bitcore',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcore;
      setHdCoin(160);
    },
  },
  {
    name: 'CCN - Cannacoin',
    onSelect: function () {
      network = libs.bitcoin.networks.cannacoin;
      setHdCoin(19);
    },
  },
  {
    name: 'CESC - Cryptoescudo',
    onSelect: function () {
      network = libs.bitcoin.networks.cannacoin;
      setHdCoin(111);
    },
  },
  {
    name: 'CDN - Canadaecoin',
    onSelect: function () {
      network = libs.bitcoin.networks.canadaecoin;
      setHdCoin(34);
    },
  },
  {
    name: 'CLAM - Clams',
    onSelect: function () {
      network = libs.bitcoin.networks.clam;
      setHdCoin(23);
    },
  },
  {
    name: 'CLO - Callisto',
    segwitAvailable: false,
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(820);
    },
  },
  {
    name: 'CLUB - Clubcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.clubcoin;
      setHdCoin(79);
    },
  },
  {
    name: 'CMP - Compcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.compcoin;
      setHdCoin(71);
    },
  },
  {
    name: 'CPU - CPUchain',
    onSelect: function () {
      network = libs.bitcoin.networks.cpuchain;
      setHdCoin(363);
    },
  },
  {
    name: 'CRAVE - Crave',
    onSelect: function () {
      network = libs.bitcoin.networks.crave;
      setHdCoin(186);
    },
  },
  {
    name: 'CRP - CranePay',
    onSelect: function () {
      network = libs.bitcoin.networks.cranepay;
      setHdCoin(2304);
    },
  },

  {
    name: 'CRW - Crown (Legacy)',
    onSelect: function () {
      network = libs.bitcoin.networks.crown;
      setHdCoin(72);
    },
  },
  {
    name: 'CRW - Crown',
    onSelect: function () {
      network = libs.bitcoin.networks.crown;
      setHdCoin(72);
    },
  },
  {
    name: 'CSC - CasinoCoin',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(359);
    },
  },
  {
    name: 'DASH - Dash',
    onSelect: function () {
      network = libs.bitcoin.networks.dash;
      setHdCoin(5);
    },
  },
  {
    name: 'DASH - Dash Testnet',
    onSelect: function () {
      network = libs.bitcoin.networks.dashtn;
      setHdCoin(1);
    },
  },
  {
    name: 'DFC - Defcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.defcoin;
      setHdCoin(1337);
    },
  },
  {
    name: 'DGB - Digibyte',
    onSelect: function () {
      network = libs.bitcoin.networks.digibyte;
      setHdCoin(20);
    },
  },
  {
    name: 'DGC - Digitalcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.digitalcoin;
      setHdCoin(18);
    },
  },
  {
    name: 'DIVI - DIVI',
    onSelect: function () {
      network = libs.bitcoin.networks.divi;
      setHdCoin(301);
    },
  },
  {
    name: 'DIVI - DIVI Testnet',
    onSelect: function () {
      network = libs.bitcoin.networks.divitestnet;
      setHdCoin(1);
    },
  },
  {
    name: 'DMD - Diamond',
    onSelect: function () {
      network = libs.bitcoin.networks.diamond;
      setHdCoin(152);
    },
  },
  {
    name: 'DNR - Denarius',
    onSelect: function () {
      network = libs.bitcoin.networks.denarius;
      setHdCoin(116);
    },
  },
  {
    name: 'DOGE - Dogecoin',
    onSelect: function () {
      network = libs.bitcoin.networks.dogecoin;
      setHdCoin(3);
    },
  },
  {
    name: 'DOGEt - Dogecoin Testnet',
    onSelect: function () {
      network = libs.bitcoin.networks.dogecointestnet;
      setHdCoin(1);
    },
  },
  {
    name: 'DXN - DEXON',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(237);
    },
  },
  {
    name: 'ECN - Ecoin',
    onSelect: function () {
      network = libs.bitcoin.networks.ecoin;
      setHdCoin(115);
    },
  },
  {
    name: 'EDRC - Edrcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.edrcoin;
      setHdCoin(56);
    },
  },
  {
    name: 'EFL - Egulden',
    onSelect: function () {
      network = libs.bitcoin.networks.egulden;
      setHdCoin(78);
    },
  },
  {
    name: 'ELLA - Ellaism',
    segwitAvailable: false,
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(163);
    },
  },
  {
    name: 'EMC2 - Einsteinium',
    onSelect: function () {
      network = libs.bitcoin.networks.einsteinium;
      setHdCoin(41);
    },
  },
  {
    name: 'ERC - Europecoin',
    onSelect: function () {
      network = libs.bitcoin.networks.europecoin;
      setHdCoin(151);
    },
  },
  {
    name: 'EOS - EOSIO',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(194);
    },
  },
  {
    name: 'ERE - EtherCore',
    segwitAvailable: false,
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(466);
    },
  },
  {
    name: 'ESN - Ethersocial Network',
    segwitAvailable: false,
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(31102);
    },
  },
  {
    name: 'ETC - Ethereum Classic',
    segwitAvailable: false,
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(61);
    },
  },
  {
    name: 'ETH - Ethereum',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(60);
    },
  },
  {
    name: 'BTT - BitTorrent',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(60);
    },
  },
  {
    name: 'EWT - EnergyWeb',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(246);
    },
  },
  {
    name: 'EXCL - Exclusivecoin',
    onSelect: function () {
      network = libs.bitcoin.networks.exclusivecoin;
      setHdCoin(190);
    },
  },
  {
    name: 'EXCC - ExchangeCoin',
    onSelect: function () {
      network = libs.bitcoin.networks.exchangecoin;
      setHdCoin(0);
    },
  },
  {
    name: 'EXP - Expanse',
    segwitAvailable: false,
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(40);
    },
  },
  {
    name: 'FIO - Foundation for Interwallet Operability',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(235);
    },
  },
  {
    name: 'FIRO - Firo (Zcoin rebrand)',
    onSelect: function () {
      network = libs.bitcoin.networks.firo;
      setHdCoin(136);
    },
  },
  {
    name: 'FIX - FIX',
    onSelect: function () {
      network = libs.bitcoin.networks.fix;
      setHdCoin(336);
    },
  },
  {
    name: 'FIX - FIX Testnet',
    onSelect: function () {
      network = libs.bitcoin.networks.fixtestnet;
      setHdCoin(1);
    },
  },
  {
    name: 'FJC - Fujicoin',
    onSelect: function () {
      network = libs.bitcoin.networks.fujicoin;
      setHdCoin(75);
    },
  },
  {
    name: 'FLASH - Flashcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.flashcoin;
      setHdCoin(120);
    },
  },
  {
    name: 'FRST - Firstcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.firstcoin;
      setHdCoin(167);
    },
  },
  {
    name: 'FTC - Feathercoin',
    onSelect: function () {
      network = libs.bitcoin.networks.feathercoin;
      setHdCoin(8);
    },
  },
  {
    name: 'GAME - GameCredits',
    onSelect: function () {
      network = libs.bitcoin.networks.game;
      setHdCoin(101);
    },
  },
  {
    name: 'GBX - Gobyte',
    onSelect: function () {
      network = libs.bitcoin.networks.gobyte;
      setHdCoin(176);
    },
  },
  {
    name: 'GCR - GCRCoin',
    onSelect: function () {
      network = libs.bitcoin.networks.gcr;
      setHdCoin(79);
    },
  },
  {
    name: 'GRC - Gridcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.gridcoin;
      setHdCoin(84);
    },
  },
  {
    name: 'GRS - Groestlcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.groestlcoin;
      setHdCoin(17);
    },
  },
  {
    name: 'GRS - Groestlcoin Testnet',
    onSelect: function () {
      network = libs.bitcoin.networks.groestlcointestnet;
      setHdCoin(1);
    },
  },
  {
    name: 'HNS - Handshake',
    onSelect: function () {
      setHdCoin(5353);
    },
  },
  {
    name: 'HNC - Helleniccoin',
    onSelect: function () {
      network = libs.bitcoin.networks.helleniccoin;
      setHdCoin(168);
    },
  },
  {
    name: 'HUSH - Hush (Legacy)',
    onSelect: function () {
      network = libs.bitcoin.networks.hush;
      setHdCoin(197);
    },
  },
  {
    name: 'HUSH - Hush3',
    onSelect: function () {
      network = libs.bitcoin.networks.hush3;
      setHdCoin(197);
    },
  },
  {
    name: 'INSN - Insane',
    onSelect: function () {
      network = libs.bitcoin.networks.insane;
      setHdCoin(68);
    },
  },
  {
    name: 'IOP - Iop',
    onSelect: function () {
      network = libs.bitcoin.networks.iop;
      setHdCoin(66);
    },
  },
  {
    name: 'IOV - Starname',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(234);
    },
  },
  {
    name: 'IXC - Ixcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.ixcoin;
      setHdCoin(86);
    },
  },
  {
    name: 'JBS - Jumbucks',
    onSelect: function () {
      network = libs.bitcoin.networks.jumbucks;
      setHdCoin(26);
    },
  },
  {
    name: 'KMD - Komodo',
    bip49available: false,
    onSelect: function () {
      network = libs.bitcoin.networks.komodo;
      setHdCoin(141);
    },
  },
  {
    name: 'KOBO - Kobocoin',
    bip49available: false,
    onSelect: function () {
      network = libs.bitcoin.networks.kobocoin;
      setHdCoin(196);
    },
  },
  {
    name: 'LBC - Library Credits',
    onSelect: function () {
      network = libs.bitcoin.networks.lbry;
      setHdCoin(140);
    },
  },
  {
    name: 'LCC - Litecoincash',
    onSelect: function () {
      network = libs.bitcoin.networks.litecoincash;
      setHdCoin(192);
    },
  },
  {
    name: 'LDCN - Landcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.landcoin;
      setHdCoin(63);
    },
  },
  {
    name: 'LINX - Linx',
    onSelect: function () {
      network = libs.bitcoin.networks.linx;
      setHdCoin(114);
    },
  },
  {
    name: 'LKR - Lkrcoin',
    segwitAvailable: false,
    onSelect: function () {
      network = libs.bitcoin.networks.lkrcoin;
      setHdCoin(557);
    },
  },
  {
    name: 'LTC - Litecoin',
    onSelect: function () {
      network = libs.bitcoin.networks.litecoin;
      setHdCoin(2);
      // DOM.litecoinLtubContainer.removeClass('hidden');
    },
  },
  {
    name: 'LTCt - Litecoin Testnet',
    onSelect: function () {
      network = libs.bitcoin.networks.litecointestnet;
      setHdCoin(1);
      // DOM.litecoinLtubContainer.removeClass('hidden');
    },
  },
  {
    name: 'LTZ - LitecoinZ',
    onSelect: function () {
      network = libs.bitcoin.networks.litecoinz;
      setHdCoin(221);
    },
  },
  {
    name: 'LUNA - Terra',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(330);
    },
  },
  {
    name: 'LYNX - Lynx',
    onSelect: function () {
      network = libs.bitcoin.networks.lynx;
      setHdCoin(191);
    },
  },
  {
    name: 'MAZA - Maza',
    onSelect: function () {
      network = libs.bitcoin.networks.maza;
      setHdCoin(13);
    },
  },
  {
    name: 'MEC - Megacoin',
    onSelect: function () {
      network = libs.bitcoin.networks.megacoin;
      setHdCoin(217);
    },
  },
  {
    name: 'MIX - MIX',
    segwitAvailable: false,
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(76);
    },
  },
  {
    name: 'MNX - Minexcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.minexcoin;
      setHdCoin(182);
    },
  },
  {
    name: 'MONA - Monacoin',
    onSelect: function () {
      (network = libs.bitcoin.networks.monacoin), setHdCoin(22);
    },
  },
  {
    name: 'MONK - Monkey Project',
    onSelect: function () {
      (network = libs.bitcoin.networks.monkeyproject), setHdCoin(214);
    },
  },
  {
    name: 'MOAC - MOAC',
    segwitAvailable: false,
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(314);
    },
  },
  {
    name: 'MUSIC - Musicoin',
    segwitAvailable: false,
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(184);
    },
  },
  {
    name: 'NANO - Nano',
    onSelect: function () {
      network = network = libs.nanoUtil.dummyNetwork;
      setHdCoin(165);
    },
  },
  {
    name: 'NAV - Navcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.navcoin;
      setHdCoin(130);
    },
  },
  {
    name: 'NAS - Nebulas',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(2718);
    },
  },
  {
    name: 'NEBL - Neblio',
    onSelect: function () {
      network = libs.bitcoin.networks.neblio;
      setHdCoin(146);
    },
  },
  {
    name: 'NEOS - Neoscoin',
    onSelect: function () {
      network = libs.bitcoin.networks.neoscoin;
      setHdCoin(25);
    },
  },
  {
    name: 'NIX - NIX Platform',
    onSelect: function () {
      network = libs.bitcoin.networks.nix;
      setHdCoin(400);
    },
  },
  {
    name: 'NLG - Gulden',
    onSelect: function () {
      network = libs.bitcoin.networks.gulden;
      setHdCoin(87);
    },
  },
  {
    name: 'NMC - Namecoin',
    onSelect: function () {
      network = libs.bitcoin.networks.namecoin;
      setHdCoin(7);
    },
  },
  {
    name: 'NRG - Energi',
    onSelect: function () {
      network = libs.bitcoin.networks.energi;
      setHdCoin(204);
    },
  },
  {
    name: 'NRO - Neurocoin',
    onSelect: function () {
      network = libs.bitcoin.networks.neurocoin;
      setHdCoin(110);
    },
  },
  {
    name: 'NSR - Nushares',
    onSelect: function () {
      network = libs.bitcoin.networks.nushares;
      setHdCoin(11);
    },
  },
  {
    name: 'NYC - Newyorkc',
    onSelect: function () {
      network = libs.bitcoin.networks.newyorkc;
      setHdCoin(179);
    },
  },
  {
    name: 'NVC - Novacoin',
    onSelect: function () {
      network = libs.bitcoin.networks.novacoin;
      setHdCoin(50);
    },
  },
  {
    name: 'OK - Okcash',
    onSelect: function () {
      network = libs.bitcoin.networks.okcash;
      setHdCoin(69);
    },
  },
  {
    name: 'OMNI - Omnicore',
    onSelect: function () {
      network = libs.bitcoin.networks.omnicore;
      setHdCoin(200);
    },
  },
  {
    name: 'ONION - DeepOnion',
    onSelect: function () {
      network = libs.bitcoin.networks.deeponion;
      setHdCoin(305);
    },
  },
  {
    name: 'ONX - Onixcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.onixcoin;
      setHdCoin(174);
    },
  },
  {
    name: 'PART - Particl',
    onSelect: function () {
      network = libs.bitcoin.networks.particl;
      setHdCoin(44);
    },
  },
  {
    name: 'PHR - Phore',
    onSelect: function () {
      network = libs.bitcoin.networks.phore;
      setHdCoin(444);
    },
  },
  {
    name: 'PINK - Pinkcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.pinkcoin;
      setHdCoin(117);
    },
  },
  {
    name: 'PIRL - Pirl',
    segwitAvailable: false,
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(164);
    },
  },
  {
    name: 'PIVX - PIVX',
    onSelect: function () {
      network = libs.bitcoin.networks.pivx;
      setHdCoin(119);
    },
  },
  {
    name: 'PIVX - PIVX Testnet',
    onSelect: function () {
      network = libs.bitcoin.networks.pivxtestnet;
      setHdCoin(1);
    },
  },
  {
    name: 'POA - Poa',
    segwitAvailable: false,
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(178);
    },
  },
  {
    name: 'POSW - POSWcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.poswcoin;
      setHdCoin(47);
    },
  },
  {
    name: 'POT - Potcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.potcoin;
      setHdCoin(81);
    },
  },
  {
    name: 'PPC - Peercoin',
    onSelect: function () {
      network = libs.bitcoin.networks.peercoin;
      setHdCoin(6);
    },
  },
  {
    name: 'PRJ - ProjectCoin',
    onSelect: function () {
      network = libs.bitcoin.networks.projectcoin;
      setHdCoin(533);
    },
  },
  {
    name: 'PSB - Pesobit',
    onSelect: function () {
      network = libs.bitcoin.networks.pesobit;
      setHdCoin(62);
    },
  },
  {
    name: 'PUT - Putincoin',
    onSelect: function () {
      network = libs.bitcoin.networks.putincoin;
      setHdCoin(122);
    },
  },
  {
    name: 'RPD - Rapids',
    onSelect: function () {
      network = libs.bitcoin.networks.rapids;
      setHdCoin(320);
    },
  },
  {
    name: 'RVN - Ravencoin',
    onSelect: function () {
      network = libs.bitcoin.networks.ravencoin;
      setHdCoin(175);
    },
  },
  {
    name: 'R-BTC - RSK',
    onSelect: function () {
      network = libs.bitcoin.networks.rsk;
      setHdCoin(137);
    },
  },
  {
    name: 'tR-BTC - RSK Testnet',
    onSelect: function () {
      network = libs.bitcoin.networks.rsktestnet;
      setHdCoin(37310);
    },
  },
  {
    name: 'RBY - Rubycoin',
    onSelect: function () {
      network = libs.bitcoin.networks.rubycoin;
      setHdCoin(16);
    },
  },
  {
    name: 'RDD - Reddcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.reddcoin;
      setHdCoin(4);
    },
  },
  {
    name: 'RITO - Ritocoin',
    onSelect: function () {
      network = libs.bitcoin.networks.ritocoin;
      setHdCoin(19169);
    },
  },
  {
    name: 'RUNE - THORChain',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(931);
    },
  },
  {
    name: 'RVR - RevolutionVR',
    onSelect: function () {
      network = libs.bitcoin.networks.revolutionvr;
      setHdCoin(129);
    },
  },
  {
    name: 'SAFE - Safecoin',
    onSelect: function () {
      network = libs.bitcoin.networks.safecoin;
      setHdCoin(19165);
    },
  },
  {
    name: 'SCRIBE - Scribe',
    onSelect: function () {
      network = libs.bitcoin.networks.scribe;
      setHdCoin(545);
    },
  },
  {
    name: 'SLS - Salus',
    onSelect: function () {
      network = libs.bitcoin.networks.salus;
      setHdCoin(63);
    },
  },
  {
    name: 'SDC - ShadowCash',
    onSelect: function () {
      network = libs.bitcoin.networks.shadow;
      setHdCoin(35);
    },
  },
  {
    name: 'SDC - ShadowCash Testnet',
    onSelect: function () {
      network = libs.bitcoin.networks.shadowtn;
      setHdCoin(1);
    },
  },
  {
    name: 'SLM - Slimcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.slimcoin;
      setHdCoin(63);
    },
  },
  {
    name: 'SLM - Slimcoin Testnet',
    onSelect: function () {
      network = libs.bitcoin.networks.slimcointn;
      setHdCoin(111);
    },
  },
  {
    name: 'SLP - Simple Ledger Protocol',
    onSelect: function () {
      // DOM.bitcoinCashAddressTypeContainer.removeClass('hidden');
      setHdCoin(245);
    },
  },
  {
    name: 'SLR - Solarcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.solarcoin;
      setHdCoin(58);
    },
  },
  {
    name: 'SMLY - Smileycoin',
    onSelect: function () {
      network = libs.bitcoin.networks.smileycoin;
      setHdCoin(59);
    },
  },
  {
    name: 'STASH - Stash',
    onSelect: function () {
      network = libs.bitcoin.networks.stash;
      setHdCoin(0xc0c0);
    },
  },
  {
    name: 'STASH - Stash Testnet',
    onSelect: function () {
      network = libs.bitcoin.networks.stashtn;
      setHdCoin(0xcafe);
    },
  },
  {
    name: 'STRAT - Stratis',
    onSelect: function () {
      network = libs.bitcoin.networks.stratis;
      setHdCoin(105);
    },
  },
  {
    name: 'SUGAR - Sugarchain',
    onSelect: function () {
      network = libs.bitcoin.networks.sugarchain;
      setHdCoin(408);
    },
  },
  {
    name: 'TUGAR - Sugarchain Testnet',
    onSelect: function () {
      network = libs.bitcoin.networks.sugarchaintestnet;
      setHdCoin(408);
    },
  },
  {
    name: 'SWTC - Jingtum',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(315);
    },
  },
  {
    name: 'TSTRAT - Stratis Testnet',
    onSelect: function () {
      network = libs.bitcoin.networks.stratistest;
      setHdCoin(105);
    },
  },
  {
    name: 'SYS - Syscoin',
    onSelect: function () {
      network = libs.bitcoin.networks.syscoin;
      setHdCoin(57);
    },
  },
  {
    name: 'THC - Hempcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.hempcoin;
      setHdCoin(113);
    },
  },
  {
    name: 'THT - Thought',
    onSelect: function () {
      network = libs.bitcoin.networks.thought;
      setHdCoin(1618);
    },
  },
  {
    name: 'TOA - Toa',
    onSelect: function () {
      network = libs.bitcoin.networks.toa;
      setHdCoin(159);
    },
  },
  {
    name: 'TRX - Tron',
    onSelect: function () {
      setHdCoin(195);
    },
  },
  {
    name: 'TWINS - TWINS',
    onSelect: function () {
      network = libs.bitcoin.networks.twins;
      setHdCoin(970);
    },
  },
  {
    name: 'TWINS - TWINS Testnet',
    onSelect: function () {
      network = libs.bitcoin.networks.twinstestnet;
      setHdCoin(1);
    },
  },
  {
    name: 'USC - Ultimatesecurecash',
    onSelect: function () {
      network = libs.bitcoin.networks.ultimatesecurecash;
      setHdCoin(112);
    },
  },
  {
    name: 'USNBT - NuBits',
    onSelect: function () {
      network = libs.bitcoin.networks.nubits;
      setHdCoin(12);
    },
  },
  {
    name: 'UNO - Unobtanium',
    onSelect: function () {
      network = libs.bitcoin.networks.unobtanium;
      setHdCoin(92);
    },
  },
  {
    name: 'VASH - Vpncoin',
    onSelect: function () {
      network = libs.bitcoin.networks.vpncoin;
      setHdCoin(33);
    },
  },
  {
    name: 'VET - VeChain',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(818);
    },
  },
  {
    name: 'VIA - Viacoin',
    onSelect: function () {
      network = libs.bitcoin.networks.viacoin;
      setHdCoin(14);
    },
  },
  {
    name: 'VIA - Viacoin Testnet',
    onSelect: function () {
      network = libs.bitcoin.networks.viacointestnet;
      setHdCoin(1);
    },
  },
  {
    name: 'VIVO - Vivo',
    onSelect: function () {
      network = libs.bitcoin.networks.vivo;
      setHdCoin(166);
    },
  },
  {
    name: 'VTC - Vertcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.vertcoin;
      setHdCoin(28);
    },
  },
  {
    name: 'WGR - Wagerr',
    onSelect: function () {
      network = libs.bitcoin.networks.wagerr;
      setHdCoin(7825266);
    },
  },
  {
    name: 'WC - Wincoin',
    onSelect: function () {
      network = libs.bitcoin.networks.wincoin;
      setHdCoin(181);
    },
  },
  {
    name: 'XAX - Artax',
    onSelect: function () {
      network = libs.bitcoin.networks.artax;
      setHdCoin(219);
    },
  },
  {
    name: 'XBC - Bitcoinplus',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoinplus;
      setHdCoin(65);
    },
  },
  {
    name: 'XLM - Stellar',
    onSelect: function () {
      network = libs.stellarUtil.dummyNetwork;
      setHdCoin(148);
    },
  },
  {
    name: 'XMY - Myriadcoin',
    onSelect: function () {
      network = libs.bitcoin.networks.myriadcoin;
      setHdCoin(90);
    },
  },
  {
    name: 'XRP - Ripple',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(144);
    },
  },
  {
    name: 'XVC - Vcash',
    onSelect: function () {
      network = libs.bitcoin.networks.vcash;
      setHdCoin(127);
    },
  },
  {
    name: 'XVG - Verge',
    onSelect: function () {
      network = libs.bitcoin.networks.verge;
      setHdCoin(77);
    },
  },
  {
    name: 'XUEZ - Xuez',
    segwitAvailable: false,
    onSelect: function () {
      network = libs.bitcoin.networks.xuez;
      setHdCoin(225);
    },
  },
  {
    name: 'XWCC - Whitecoin Classic',
    onSelect: function () {
      network = libs.bitcoin.networks.whitecoin;
      setHdCoin(155);
    },
  },
  {
    name: 'XZC - Zcoin (rebranded to Firo)',
    onSelect: function () {
      network = libs.bitcoin.networks.zcoin;
      setHdCoin(136);
    },
  },
  {
    name: 'ZBC - ZooBlockchain',
    onSelect: function () {
      network = libs.bitcoin.networks.zoobc;
      setHdCoin(883);
    },
  },
  {
    name: 'ZCL - Zclassic',
    onSelect: function () {
      network = libs.bitcoin.networks.zclassic;
      setHdCoin(147);
    },
  },
  {
    name: 'ZEC - Zcash',
    onSelect: function () {
      network = libs.bitcoin.networks.zcash;
      setHdCoin(133);
    },
  },
  {
    name: 'ZEN - Horizen',
    onSelect: function () {
      network = libs.bitcoin.networks.zencash;
      setHdCoin(121);
    },
  },
  {
    name: 'XWC - Whitecoin',
    onSelect: function () {
      network = libs.bitcoin.networks.bitcoin;
      setHdCoin(559);
    },
  },
  {
    name: 'XMR - Monero',
    onSelect: function () {
      network = libs.bitcoin.networks.monero;
      setHdCoin(128);
    },
  },
];

function setHdCoin(number) {
  globalCoin = number;
}

//Sorts the first array by the values in the second array
function sortArrayByValues(arr1, arr2) {
  const sortedArr = [];
  for (let i = 0; i < arr2.length; i++) {
    sortedArr.push(arr1[arr1.indexOf(arr2[i])]);
  }
  for (let i = 0; i < arr1.length; i++) {
    if (!sortedArr.includes(arr1[i])) {
      sortedArr.push(arr1[i]);
    }
  }
  return sortedArr;
}

let names = networks.map(obj => obj.name);
window.networksNames = sortArrayByValues(names, topOrder);
