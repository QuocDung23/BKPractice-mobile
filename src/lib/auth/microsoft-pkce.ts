import * as Crypto from "expo-crypto";

export type MicrosoftPkce = {
  verifier: string;
  challenge: string;
};

const base64UrlAlphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function encodeBase64Url(bytes: Uint8Array): string {
  let result = "";
  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index] ?? 0;
    const hasSecond = index + 1 < bytes.length;
    const second = hasSecond ? (bytes[index + 1] ?? 0) : 0;
    const hasThird = index + 2 < bytes.length;
    const third = hasThird ? (bytes[index + 2] ?? 0) : 0;
    result += base64UrlAlphabet.charAt(first >> 2);
    result += base64UrlAlphabet.charAt(((first & 0x03) << 4) | (second >> 4));
    if (hasSecond)
      result += base64UrlAlphabet.charAt(((second & 0x0f) << 2) | (third >> 6));
    if (hasThird) result += base64UrlAlphabet.charAt(third & 0x3f);
  }
  return result;
}

function toBase64Url(value: string): string {
  return value.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createMicrosoftPkce(): Promise<MicrosoftPkce> {
  const verifier = encodeBase64Url(await Crypto.getRandomBytesAsync(32));
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    verifier,
    { encoding: Crypto.CryptoEncoding.BASE64 },
  );
  return { verifier, challenge: toBase64Url(digest) };
}
