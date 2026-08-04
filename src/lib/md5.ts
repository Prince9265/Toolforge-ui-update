/* Compact MD5 implementation (public-domain style), runs entirely in-browser. */
function toWords(input: string): number[] {
  const bytes = new TextEncoder().encode(input);
  const length = bytes.length;
  const words: number[] = [];
  for (let i = 0; i < length; i++) {
    words[i >> 2] = (words[i >> 2] ?? 0) | ((bytes[i] ?? 0) << ((i % 4) * 8));
  }
  words[length >> 2] = (words[length >> 2] ?? 0) | (0x80 << ((length % 4) * 8));
  const total = (((length + 8) >> 6) + 1) * 16;
  for (let i = 0; i < total; i++) words[i] = words[i] ?? 0;
  words[total - 2] = length * 8;
  words[total - 1] = 0;
  return words;
}

const add = (a: number, b: number) => (a + b) | 0;
const rol = (n: number, c: number) => (n << c) | (n >>> (32 - c));

const S = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14,
  20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6,
  10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
];

const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296));

export function md5(input: string): string {
  const words = toWords(input);
  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let chunk = 0; chunk < words.length; chunk += 16) {
    let [a, b, c, d] = [a0, b0, c0, d0];
    for (let i = 0; i < 64; i++) {
      let f: number;
      let g: number;
      if (i < 16) {
        f = (b & c) | (~b & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | (~d & c);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * i) % 16;
      }
      const tmp = d;
      d = c;
      c = b;
      b = add(b, rol(add(add(a, f), add(K[i] ?? 0, words[chunk + g] ?? 0)), S[i] ?? 0));
      a = tmp;
    }
    a0 = add(a0, a);
    b0 = add(b0, b);
    c0 = add(c0, c);
    d0 = add(d0, d);
  }

  return [a0, b0, c0, d0]
    .map((n) =>
      Array.from({ length: 4 }, (_, i) =>
        ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, "0"),
      ).join(""),
    )
    .join("");
}