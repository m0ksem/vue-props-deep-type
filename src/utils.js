function adaptValidator(type) {
  if (type.type) return type;

  return { type };
}

function correctTypeName(type) {
  let correctType = type.name ? type.name : type;
  if (type.constructor === Object) return 'Object';
  if (type.constructor === Array) {
    correctType = `[${type.map(correctTypeName).join(', ')}]`;
  }
  if (type.constructor === String) correctType = `'${type}'`;

  return correctType;
}

function isPrimitive(type) {
  const isObject = typeof type === 'object';
  const isFunction = typeof type === 'function';

  return !(isObject || isFunction);
}

function isArrayInstance(validator) {
  return validator.constructor === Array;
}

function isObjectInstance(validator) {
  return validator.constructor === Object;
}

module.exports = {
  adaptValidator,
  correctTypeName,
  isPrimitive,
  isArrayInstance,
  isObjectInstance,
}
