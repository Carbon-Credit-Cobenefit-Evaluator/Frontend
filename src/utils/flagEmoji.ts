// utils/flagEmoji.js
export function getFlagEmoji(countryCode: string) {
  if (!countryCode) return '';

  // Make sure it's uppercase
  const code = countryCode.toUpperCase();

  // Convert each letter to regional indicator symbols
  const firstChar = String.fromCodePoint(0x1f1e6 + code.charCodeAt(0) - 65);
  const secondChar = String.fromCodePoint(0x1f1e6 + code.charCodeAt(1) - 65);

  return firstChar + secondChar;
}
