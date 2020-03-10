const crypto = require('crypto');

class Crypto {
  constructor() {
    this.key = process.env.SECRET_KEY;
    this.iv = process.env.SECRET_IV;
  }

  encrypt(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.key), this.iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return { iv: this.iv.toString('hex'), encryptedData: encrypted.toString('hex') }
  }

  decrypt(text) {
    const iv = Buffer.from(text.iv, 'hex');
    const encryptedText = Buffer.from(text.encryptedData, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.key), this.iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }
}

module.exports = new Crypto();
