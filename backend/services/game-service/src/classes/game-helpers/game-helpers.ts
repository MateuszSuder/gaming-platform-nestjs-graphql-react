import * as crypto from 'crypto';

export class GameHelpers {
  public generateRandomInteger(min: number, max: number) {
    const range = max - min + 1;
    const randomBytes = crypto.randomBytes(4);
    const randomValue = randomBytes.readUInt32BE(0);
    return Math.floor((randomValue / 0xffffffff) * range) + min;
  }
}
