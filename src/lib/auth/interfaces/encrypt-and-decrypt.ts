export interface ICompareEncryptedValues {
  compare(decrypted: string, encrypted: string): boolean | Promise<boolean>;
}
