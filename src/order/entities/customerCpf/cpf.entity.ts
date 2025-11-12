import { BaseException } from "src/shared/exceptions/exceptions.base";

export class Cpf {
  private readonly cpf: string;
  
  private constructor(cpf: string) {
    this.cpf = this.onlyNumbers(cpf);
    if (!Cpf.isValid(this.cpf)) {
      throw new BaseException('Invalid CPF', 400, 'INVALID_CPF');
    }
  }

 
  static create(cpf: string): Cpf {
    return new Cpf(cpf);
  }

  private onlyNumbers(str: string) {
    return str.replace(/\D/g, '');
  }

  static isValid(cpf: string): boolean {
    if (cpf.length !== 11) return false;
    return true;
  }
  
  getCpf(): string {
    return this.cpf;
  }
}
