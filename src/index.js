/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
const Utils = require('./utils');

class Validation {
  constructor(value, type, name) {
    this.errors = [];

    this.test(value, type, name || 'prop');
  }

  get isValid() { return this.errors.length === 0; }

  error(text) { this.errors.push(text); }

  createWrongTypeError(name, value, type) {
    this.error(`Type check failed ${name}. Expected ${Utils.correctTypeName(type)}, got ${Utils.correctTypeName(value)}`);
  }

  createRequiredError(name, type) {
    this.error(`${name} is required and must be ${Utils.correctTypeName(type)}`);
  }

  testMultiTypes(value, validator, name) {
    const types = validator.type;
    let errors = [];
    const isSomeTypeValid = types.some((type) => {
      const validation = new Validation(value, type, name);

      if (!validation.isValid) {
        errors = [...errors, ...validation.errors];
        return false;
      }
      return true;
    });

    if (!isSomeTypeValid) this.errors = [...this.errors, ...errors];
  }

  testArray(value, validator, name) {
    if (value.constructor !== Array) {
      this.createWrongTypeError(name, value, 'Array');
      return;
    }

    if (!validator.item) return;
    if (validator.notClear && value.length === 0) this.createRequiredError(`${name}[0]`, validator.item);
    value.forEach((item, i) => this.test(item, validator.item, `${name}[${i}]`));
  }

  testObject(value, validator, name) {
    if (value.constructor !== Object) {
      this.createWrongTypeError(name, value, 'Object');
      return;
    }

    Object.keys(validator.type).forEach((key) => {
      const property = value[key];
      const propertyValidator = validator.type[key];

      this.test(property, propertyValidator, `${name}.${key}`);

      const defaultValue = propertyValidator.default;
      if (defaultValue !== undefined) {
        value[key] = defaultValue;
      }
    });
  }

  test(value, validator, name) {
    const adaptedValidator = Utils.adaptValidator(validator);
    const validatorType = adaptedValidator.type;

    if (Utils.isPrimitive(validatorType) && value === validatorType) return;

    if (value === undefined) {
      if (adaptedValidator.required) this.createRequiredError(name, validatorType);
    } else if (Utils.isArrayInstance(validatorType)) {
      this.testMultiTypes(value, adaptedValidator, name);
    } else if (validatorType === Array) {
      this.testArray(value, adaptedValidator, name);
    } else if (validatorType === Object || Utils.isObjectInstance(validatorType)) {
      this.testObject(value, adaptedValidator, name);
    } else if (value.constructor !== validatorType) {
      this.createWrongTypeError(name, value, validatorType);
    }
  }
}

module.exports = {
  deep(validator) {
    return {
      validator(value) {
        const validation = new Validation(value, validator);

        if (!validation.isValid) console.error('Found errors:', validation.errors);

        return validation.isValid;
      },
      test(value) {
        const validation = new Validation(value, validator);

        return validation.isValid;
      },
      default: () => validator.default,
      required: validator.required,
    };
  },
  Array(item, required) {
    return {
      type: Array,
      item,
      required,
    };
  },
  Object(object, required) {
    return {
      type: object,
      required,
    };
  },
};
