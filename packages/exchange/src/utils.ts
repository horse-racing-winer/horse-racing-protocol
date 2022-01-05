export function randomHex(length: number): string {
  const result: string[] = [];
  const characters = 'ABCDEFabcdef0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }

  return '0x' + result.join('');
}
