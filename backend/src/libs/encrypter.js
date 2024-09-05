import crypto from 'crypto'

//Para usar instanciar la clase
//El constructor toma la llave en .env como parámetro 
//Para acceder a la llave se usa process.env.ENCRYPT_KEY
//Luega para encriptar/desencriptar nada más usar la instancia y los métodos 


export default class Encrypter {
    constructor(encryptionKey) {
      this.algorithm = "aes-192-cbc";
      this.key = crypto.scryptSync(encryptionKey, "salt", 24);
    }
  
    encrypt(clearText) {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
      const encrypted = cipher.update(clearText, "utf8", "hex");
      return [
        encrypted + cipher.final("hex"),
        Buffer.from(iv).toString("hex"),
      ].join("|");
    }
  
    dencrypt(encryptedText) {
      const [encrypted, iv] = encryptedText.split("|");
      if (!iv) throw new Error("IV not found");
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.key,
        Buffer.from(iv, "hex")
      );
      return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
    }
}
