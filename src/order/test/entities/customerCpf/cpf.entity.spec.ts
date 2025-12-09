/* eslint-disable prettier/prettier */
import { Cpf } from '../../../entities/customerCpf/cpf.entity';
import { BaseException } from 'src/shared/exceptions/exceptions.base';

describe('Cpf', () => {
  describe('create', () => {
    it('should create a valid CPF with 11 digits', () => {
      const cpf = Cpf.create('12345678901');

      expect(cpf).toBeInstanceOf(Cpf);
      expect(cpf.getCpf()).toBe('12345678901');
    });

    it('should create a valid CPF removing non-numeric characters', () => {
      const cpf = Cpf.create('123.456.789-01');

      expect(cpf).toBeInstanceOf(Cpf);
      expect(cpf.getCpf()).toBe('12345678901');
    });

    it('should create a valid CPF with mixed characters', () => {
      const cpf = Cpf.create('123-456-789-01');

      expect(cpf).toBeInstanceOf(Cpf);
      expect(cpf.getCpf()).toBe('12345678901');
    });

    it('should throw BaseException when CPF has less than 11 digits', () => {
      expect(() => {
        Cpf.create('1234567890');
      }).toThrow(BaseException);

      expect(() => {
        Cpf.create('1234567890');
      }).toThrow('Invalid CPF');
    });

    it('should throw BaseException when CPF has more than 11 digits', () => {
      expect(() => {
        Cpf.create('123456789012');
      }).toThrow(BaseException);
    });

    it('should throw BaseException when CPF is empty', () => {
      expect(() => {
        Cpf.create('');
      }).toThrow(BaseException);
    });

    it('should throw BaseException with correct error code', () => {
      try {
        Cpf.create('123');
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).errorCode).toBe('INVALID_CPF');
        expect((error as BaseException).statusCode).toBe(400);
      }
    });
  });

  describe('isValid', () => {
    it('should return true for valid CPF with 11 digits', () => {
      expect(Cpf.isValid('12345678901')).toBe(true);
    });

    it('should return false for CPF with less than 11 digits', () => {
      expect(Cpf.isValid('1234567890')).toBe(false);
    });

    it('should return false for CPF with more than 11 digits', () => {
      expect(Cpf.isValid('123456789012')).toBe(false);
    });

    it('should return false for empty CPF', () => {
      expect(Cpf.isValid('')).toBe(false);
    });
  });

  describe('getCpf', () => {
    it('should return the CPF value', () => {
      const cpf = Cpf.create('12345678901');

      expect(cpf.getCpf()).toBe('12345678901');
    });

    it('should return CPF without formatting', () => {
      const cpf = Cpf.create('123.456.789-01');

      expect(cpf.getCpf()).toBe('12345678901');
    });
  });
});
