import { Cpf } from './cpf.entity';
import { BaseException } from 'src/shared/exceptions/exceptions.base';

describe('Cpf', () => {
  describe('create', () => {
    it('should create a valid CPF with 11 digits', () => {
      const cpfString = '12345678901';

      const cpf = Cpf.create(cpfString);

      expect(cpf).toBeDefined();
      expect(cpf.getCpf()).toBe(cpfString);
    });

    it('should create CPF and remove non-numeric characters', () => {
      const cpfFormatted = '123.456.789-01';
      const cpfClean = '12345678901';

      const cpf = Cpf.create(cpfFormatted);

      expect(cpf.getCpf()).toBe(cpfClean);
    });

    it('should sanitize CPF with dots and dashes', () => {
      const cpfFormatted = '111.222.333-44';
      const cpfClean = '11122233344';

      const cpf = Cpf.create(cpfFormatted);

      expect(cpf.getCpf()).toBe(cpfClean);
    });

    it('should throw BaseException when CPF has less than 11 digits', () => {
      const cpfShort = '123456789'; // 9 digits

      expect(() => Cpf.create(cpfShort)).toThrow(BaseException);
    });

    it('should throw BaseException with message "Invalid CPF"', () => {
      const cpfInvalid = '12345';

      expect(() => Cpf.create(cpfInvalid)).toThrow('Invalid CPF');
    });

    it('should throw BaseException with status code 400', () => {
      const cpfInvalid = '123';

      try {
        Cpf.create(cpfInvalid);
        fail('Should have thrown BaseException');
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).statusCode).toBe(400);
      }
    });

    it('should throw BaseException with error code INVALID_CPF', () => {
      const cpfInvalid = '1234567890'; // 10 digits

      try {
        Cpf.create(cpfInvalid);
        fail('Should have thrown BaseException');
      } catch (error) {
        expect(error).toBeInstanceOf(BaseException);
        expect((error as BaseException).errorCode).toBe('INVALID_CPF');
      }
    });

    it('should throw BaseException when CPF has more than 11 digits', () => {
      const cpfLong = '123456789012'; // 12 digits

      expect(() => Cpf.create(cpfLong)).toThrow(BaseException);
    });

    it('should create CPF with exactly 11 digits', () => {
      const cpfValid = '98765432101';

      const cpf = Cpf.create(cpfValid);

      expect(cpf.getCpf()).toBe(cpfValid);
      expect(cpf.getCpf().length).toBe(11);
    });

    it('should remove spaces from CPF', () => {
      const cpfWithSpaces = '123 456 789 01';
      const cpfClean = '12345678901';

      const cpf = Cpf.create(cpfWithSpaces);

      expect(cpf.getCpf()).toBe(cpfClean);
    });

    it('should remove special characters from CPF', () => {
      const cpfWithSpecial = '123@456#789$01';
      const cpfClean = '12345678901';

      const cpf = Cpf.create(cpfWithSpecial);

      expect(cpf.getCpf()).toBe(cpfClean);
    });

    it('should handle CPF with only numbers', () => {
      const cpfNumbers = '00011122233';

      const cpf = Cpf.create(cpfNumbers);

      expect(cpf.getCpf()).toBe(cpfNumbers);
    });

    it('should throw error for empty string', () => {
      const cpfEmpty = '';

      expect(() => Cpf.create(cpfEmpty)).toThrow(BaseException);
    });

    it('should throw error for CPF with only non-numeric characters', () => {
      const cpfNonNumeric = 'abc-def-ghi';

      expect(() => Cpf.create(cpfNonNumeric)).toThrow(BaseException);
    });

    it('should handle CPF starting with zeros', () => {
      const cpfWithZeros = '00000000011';

      const cpf = Cpf.create(cpfWithZeros);

      expect(cpf.getCpf()).toBe(cpfWithZeros);
    });

    it('should create multiple CPF instances independently', () => {
      const cpf1 = Cpf.create('11111111111');
      const cpf2 = Cpf.create('22222222222');

      expect(cpf1.getCpf()).toBe('11111111111');
      expect(cpf2.getCpf()).toBe('22222222222');
      expect(cpf1.getCpf()).not.toBe(cpf2.getCpf());
    });

    it('should handle CPF with mixed formatting', () => {
      const cpfMixed = '123.456.78901';
      const cpfClean = '12345678901';

      const cpf = Cpf.create(cpfMixed);

      expect(cpf.getCpf()).toBe(cpfClean);
    });

    it('should throw error when formatted CPF results in less than 11 digits', () => {
      const cpfFormatted = '123.456.789-0'; // Only 10 digits

      expect(() => Cpf.create(cpfFormatted)).toThrow(BaseException);
    });

    it('should throw error when formatted CPF results in more than 11 digits', () => {
      const cpfFormatted = '123.456.789-012'; // 12 digits

      expect(() => Cpf.create(cpfFormatted)).toThrow(BaseException);
    });
  });

  describe('getCpf', () => {
    it('should return the sanitized CPF', () => {
      const cpfString = '12345678901';
      const cpf = Cpf.create(cpfString);

      const result = cpf.getCpf();

      expect(result).toBe(cpfString);
    });

    it('should return CPF without formatting', () => {
      const cpfFormatted = '123.456.789-01';
      const cpfClean = '12345678901';
      const cpf = Cpf.create(cpfFormatted);

      const result = cpf.getCpf();

      expect(result).toBe(cpfClean);
      expect(result).not.toContain('.');
      expect(result).not.toContain('-');
    });

    it('should return only numbers', () => {
      const cpfFormatted = '000.111.222-33';
      const cpf = Cpf.create(cpfFormatted);

      const result = cpf.getCpf();

      expect(result).toMatch(/^\d+$/);
      expect(result).toBe('00011122233');
    });

    it('should return same value on multiple calls', () => {
      const cpf = Cpf.create('12345678901');

      const result1 = cpf.getCpf();
      const result2 = cpf.getCpf();

      expect(result1).toBe(result2);
      expect(result1).toBe('12345678901');
    });
  });

  describe('isValid', () => {
    it('should return true for CPF with exactly 11 digits', () => {
      const cpf = '12345678901';

      const result = Cpf.isValid(cpf);

      expect(result).toBe(true);
    });

    it('should return false for CPF with less than 11 digits', () => {
      const cpf = '123456789'; // 9 digits

      const result = Cpf.isValid(cpf);

      expect(result).toBe(false);
    });

    it('should return false for CPF with more than 11 digits', () => {
      const cpf = '123456789012'; // 12 digits

      const result = Cpf.isValid(cpf);

      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      const cpf = '';

      const result = Cpf.isValid(cpf);

      expect(result).toBe(false);
    });

    it('should return true for CPF with all zeros', () => {
      const cpf = '00000000000';

      const result = Cpf.isValid(cpf);

      expect(result).toBe(true);
    });

    it('should return true for CPF with all same digits', () => {
      const cpf = '11111111111';

      const result = Cpf.isValid(cpf);

      expect(result).toBe(true);
    });

    it('should return false for CPF with 10 digits', () => {
      const cpf = '1234567890';

      const result = Cpf.isValid(cpf);

      expect(result).toBe(false);
    });

    it('should return false for CPF with 12 digits', () => {
      const cpf = '123456789012';

      const result = Cpf.isValid(cpf);

      expect(result).toBe(false);
    });

    it('should validate multiple different CPFs', () => {
      expect(Cpf.isValid('12345678901')).toBe(true);
      expect(Cpf.isValid('98765432101')).toBe(true);
      expect(Cpf.isValid('00011122233')).toBe(true);
      expect(Cpf.isValid('123')).toBe(false);
      expect(Cpf.isValid('123456789012')).toBe(false);
    });
  });

  describe('integration tests', () => {
    it('should create valid CPF and retrieve it', () => {
      const cpfString = '12345678901';

      const cpf = Cpf.create(cpfString);

      expect(cpf).toBeDefined();
      expect(cpf.getCpf()).toBe(cpfString);
      expect(Cpf.isValid(cpf.getCpf())).toBe(true);
    });

    it('should sanitize and validate CPF in creation process', () => {
      const cpfFormatted = '123.456.789-01';
      const cpfClean = '12345678901';

      const cpf = Cpf.create(cpfFormatted);

      expect(cpf.getCpf()).toBe(cpfClean);
      expect(Cpf.isValid(cpf.getCpf())).toBe(true);
    });

    it('should reject invalid CPF during creation', () => {
      const cpfInvalid = '123';

      expect(() => Cpf.create(cpfInvalid)).toThrow(BaseException);
      expect(Cpf.isValid('123')).toBe(false);
    });

    it('should handle common CPF formats', () => {
      const formats = [
        { input: '12345678901', expected: '12345678901' },
        { input: '123.456.789-01', expected: '12345678901' },
        { input: '000.111.222-33', expected: '00011122233' },
        { input: '111 222 333 44', expected: '11122233344' },
      ];

      formats.forEach(({ input, expected }) => {
        const cpf = Cpf.create(input);
        expect(cpf.getCpf()).toBe(expected);
        expect(Cpf.isValid(cpf.getCpf())).toBe(true);
      });
    });

    it('should reject various invalid CPF formats', () => {
      const invalidCpfs = [
        '',
        '123',
        '12345',
        '123456789',
        '1234567890',
        '123456789012',
        '123456789012345',
        'abc',
        '...-',
      ];

      invalidCpfs.forEach((cpf) => {
        expect(() => Cpf.create(cpf)).toThrow(BaseException);
      });
    });
  });
});
