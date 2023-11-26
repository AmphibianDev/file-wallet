import { UseSuspenseQueryOptions, useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

const loadScript = (src: string, signal?: AbortSignal) => {
    const scriptLoaded = Array.from(document.getElementsByTagName('script')).some(
        (script) => script.src === src
    );
    if (scriptLoaded) {
        console.log(`Script already loaded: ${src}`);
        return Promise.resolve(src);
    }
    return new Promise<string>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.type = 'text/javascript';
        script.async = false;
        script.onload = () => {
            resolve(src);
        };
        script.onerror = () => { reject() };
        if (!signal?.aborted) document.head.appendChild(script);
        else reject();
    });
}

const makeScriptQuery = (src: string): UseSuspenseQueryOptions => ({
    queryKey: ['script', src],
    queryFn: ({ signal }) => loadScript(src, signal),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
});

const ScriptsProvider = ({ children }: PropsWithChildren) => {
    // These scripts are loaded in parallel
    useSuspenseQueries({
        queries: [
            'bip39/bip39-libs.js',
            'bip39/bitcoinjs-extensions.js',
            'bip39/segwit-parameters.js',
            'bip39/ripple-util.js',
            'bip39/jingtum-util.js',
            'bip39/casinocoin-util.js',
            'bip39/cosmos-util.js',
            'bip39/eos-util.js',
            'bip39/fio-util.js',
            'bip39/xwc-util.js',
            'bip39/sjcl-bip39.js',
            'bip39/wordlist_english.js',
            'bip39/wordlist_japanese.js',
            'bip39/wordlist_spanish.js',
            'bip39/wordlist_chinese_simplified.js',
            'bip39/wordlist_chinese_traditional.js',
            'bip39/wordlist_french.js',
            'bip39/wordlist_italian.js',
            'bip39/wordlist_korean.js',
            'bip39/wordlist_czech.js',
            'bip39/wordlist_portuguese.js',
            'bip39/jsbip39.js',
            'bip39/entropy.js',
            'bip39/monero.js',
            'bip39/sha3.js',
        ].map((src) => makeScriptQuery(src)),
    });

    // This is the script depends on the above scripts so must be loaded last
    useSuspenseQuery(makeScriptQuery('bip39/index.js'));

    // // For dev purposes, create a delay to simulate slow loading
    // useSuspenseQuery({
    //     queryKey: ['delay'],
    //     queryFn: () => new Promise((resolve) => setTimeout(() => resolve("delay"), 1000)),
    // })

    return <>{children}</>;
}

export default ScriptsProvider
