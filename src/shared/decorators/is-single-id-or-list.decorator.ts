import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsSingleIdOrList(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSingleIdOrList',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true;

          if (typeof value === 'object' && 'value' in value) {
            return (
              typeof value.value === 'number' && Number.isInteger(value.value)
            );
          }

          if (typeof value === 'object' && Array.isArray(value.ids)) {
            return value.ids.every(
              (v) => typeof v === 'number' && Number.isInteger(v),
            );
          }

          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must contain only integer IDs (no strings allowed)`;
        },
      },
    });
  };
}
