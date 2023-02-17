export interface IEncryptAndDecrypt {
  compare(decrypted: string, encrypted: string): boolean | Promise<boolean>;
}
