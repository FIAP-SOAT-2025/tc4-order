import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ExceptionMapper } from './exception.mapper';
import { BaseException } from './exceptions.base';

describe('ExceptionMapper', () => {
  describe('mapToHttpException', () => {
    it('should return the same HttpException if error is already HttpException', () => {
      const httpException = new BadRequestException('Bad request');

      const result = ExceptionMapper.mapToHttpException(httpException as any);

      expect(result).toBe(httpException);
    });

    it('should map BaseException with status 400 to BadRequestException', () => {
      const baseException = new BaseException('Invalid input', 400, 'BAD_REQUEST');

      const result = ExceptionMapper.mapToHttpException(baseException);

      expect(result).toBeInstanceOf(BadRequestException);
      expect(result.getStatus()).toBe(400);
    });

    it('should map BaseException with status 401 to UnauthorizedException', () => {
      const baseException = new BaseException('Unauthorized', 401, 'UNAUTHORIZED');

      const result = ExceptionMapper.mapToHttpException(baseException);

      expect(result).toBeInstanceOf(UnauthorizedException);
      expect(result.getStatus()).toBe(401);
    });

    it('should map BaseException with status 403 to ForbiddenException', () => {
      const baseException = new BaseException('Forbidden', 403, 'FORBIDDEN');

      const result = ExceptionMapper.mapToHttpException(baseException);

      expect(result).toBeInstanceOf(ForbiddenException);
      expect(result.getStatus()).toBe(403);
    });

    it('should map BaseException with status 404 to NotFoundException', () => {
      const baseException = new BaseException('Not found', 404, 'NOT_FOUND');

      const result = ExceptionMapper.mapToHttpException(baseException);

      expect(result).toBeInstanceOf(NotFoundException);
      expect(result.getStatus()).toBe(404);
    });

    it('should map BaseException with status 409 to ConflictException', () => {
      const baseException = new BaseException('Conflict', 409, 'CONFLICT');

      const result = ExceptionMapper.mapToHttpException(baseException);

      expect(result).toBeInstanceOf(ConflictException);
      expect(result.getStatus()).toBe(409);
    });

    it('should map BaseException with status 422 to UnprocessableEntityException', () => {
      const baseException = new BaseException(
        'Unprocessable entity',
        422,
        'UNPROCESSABLE_ENTITY',
      );

      const result = ExceptionMapper.mapToHttpException(baseException);

      expect(result).toBeInstanceOf(UnprocessableEntityException);
      expect(result.getStatus()).toBe(422);
    });

    it('should map BaseException with status 500 to InternalServerErrorException', () => {
      const baseException = new BaseException(
        'Internal error',
        500,
        'INTERNAL_SERVER_ERROR',
      );

      const result = ExceptionMapper.mapToHttpException(baseException);

      expect(result).toBeInstanceOf(InternalServerErrorException);
      expect(result.getStatus()).toBe(500);
    });

    it('should map BaseException with unknown status to InternalServerErrorException', () => {
      const baseException = new BaseException('Unknown error', 999, 'UNKNOWN_ERROR');

      const result = ExceptionMapper.mapToHttpException(baseException);

      expect(result).toBeInstanceOf(InternalServerErrorException);
      expect(result.getStatus()).toBe(500);
    });

    it('should return InternalServerErrorException for non-BaseException errors', () => {
      const genericError = new Error('Generic error') as any;

      const result = ExceptionMapper.mapToHttpException(genericError);

      expect(result).toBeInstanceOf(InternalServerErrorException);
      expect(result.message).toBe('Internal server error');
    });

    it('should preserve error message in mapped exception', () => {
      const baseException = new BaseException(
        'Customer not found',
        404,
        'CUSTOMER_NOT_FOUND',
      );

      const result = ExceptionMapper.mapToHttpException(baseException);

      const response = result.getResponse() as any;
      expect(response.message).toBe('Customer not found');
    });

    it('should preserve error code in mapped exception', () => {
      const baseException = new BaseException(
        'Item not available',
        400,
        'ITEM_NOT_AVAILABLE',
      );

      const result = ExceptionMapper.mapToHttpException(baseException);

      const response = result.getResponse() as any;
      expect(response.errorCode).toBe('ITEM_NOT_AVAILABLE');
    });

    it('should preserve status code in mapped exception response', () => {
      const baseException = new BaseException('Payment failed', 422, 'PAYMENT_FAILED');

      const result = ExceptionMapper.mapToHttpException(baseException);

      const response = result.getResponse() as any;
      expect(response.statusCode).toBe(422);
    });

    it('should handle BaseException with empty message', () => {
      const baseException = new BaseException('', 400, 'EMPTY_MESSAGE');

      const result = ExceptionMapper.mapToHttpException(baseException);

      expect(result).toBeInstanceOf(BadRequestException);
      const response = result.getResponse() as any;
      expect(response.message).toBe('');
    });

    it('should handle BaseException with special characters in message', () => {
      const baseException = new BaseException(
        'Error: <script>alert("xss")</script>',
        400,
        'XSS_ATTEMPT',
      );

      const result = ExceptionMapper.mapToHttpException(baseException);

      const response = result.getResponse() as any;
      expect(response.message).toContain('<script>');
    });

    it('should map multiple exceptions with same status code consistently', () => {
      const exception1 = new BaseException('Error 1', 404, 'ERROR_1');
      const exception2 = new BaseException('Error 2', 404, 'ERROR_2');

      const result1 = ExceptionMapper.mapToHttpException(exception1);
      const result2 = ExceptionMapper.mapToHttpException(exception2);

      expect(result1).toBeInstanceOf(NotFoundException);
      expect(result2).toBeInstanceOf(NotFoundException);
    });
  });
});
