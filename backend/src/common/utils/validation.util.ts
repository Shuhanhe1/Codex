import { ValidationError } from 'class-validator';

export class ValidationUtil {
  static formatValidationErrors(errors: ValidationError[]): string[] {
    return errors.map(error => {
      const constraints = error.constraints;
      if (constraints) {
        return Object.values(constraints).join(', ');
      }
      return `${error.property} is invalid`;
    });
  }
}
