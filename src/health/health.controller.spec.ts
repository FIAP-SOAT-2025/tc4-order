import { HealthController } from './health.controller';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(() => {
    healthController = new HealthController();
  });

  describe('check', () => {
    it('should return status ok', () => {
      const result = healthController.check();

      expect(result).toEqual({ status: 'ok' });
    });

    it('should return an object with status property', () => {
      const result = healthController.check();

      expect(result).toHaveProperty('status');
    });

    it('should return status as string', () => {
      const result = healthController.check();

      expect(typeof result.status).toBe('string');
    });

    it('should always return the same response', () => {
      const result1 = healthController.check();
      const result2 = healthController.check();

      expect(result1).toEqual(result2);
    });

    it('should return ok value for status', () => {
      const result = healthController.check();

      expect(result.status).toBe('ok');
    });
  });
});
