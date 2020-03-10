import crypto from 'crypto';

const Crypto = {
    decrypt: function(text) {
        
        const iv = Buffer.from(text[0].iv, 'hex');
        const encryptedText = Buffer.from(text[0].encryptedData, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.REACT_APP_SECRET_KEY), process.env.REACT_APP_SECRET_IV);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
    
        return decrypted.toString();
    }
}

export default Crypto;