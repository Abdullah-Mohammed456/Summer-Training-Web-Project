import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

const saltLength = 16;
const derivedKeyLength = 64;
const scryptCost = 32_768;
const scryptBlockSize = 8;
const scryptParallelization = 1;
const scryptMaxMemory = 64 * 1024 * 1024;

const deriveKey = (password: string, salt: Buffer): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      derivedKeyLength,
      {
        N: scryptCost,
        r: scryptBlockSize,
        p: scryptParallelization,
        maxmem: scryptMaxMemory,
      },
      (error, derivedKey) => {
        if (error) reject(error);
        else resolve(derivedKey);
      },
    );
  });

export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(saltLength);
  const derivedKey = await deriveKey(password, salt);
  return `scrypt$${scryptCost}$${salt.toString('hex')}$${derivedKey.toString('hex')}`;
};

export const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {
  const [algorithm, encodedCost, encodedSalt, encodedKey, extra] = storedHash.split('$');
  const cost = Number(encodedCost);
  if (
    algorithm !== 'scrypt' ||
    extra !== undefined ||
    cost !== scryptCost ||
    !encodedSalt ||
    !encodedKey ||
    !/^[\da-f]+$/i.test(encodedSalt) ||
    !/^[\da-f]+$/i.test(encodedKey)
  ) {
    return false;
  }

  const salt = Buffer.from(encodedSalt, 'hex');
  const expectedKey = Buffer.from(encodedKey, 'hex');
  if (salt.length !== saltLength || expectedKey.length !== derivedKeyLength) {
    return false;
  }

  const actualKey = await deriveKey(password, salt);
  return timingSafeEqual(actualKey, expectedKey);
};
