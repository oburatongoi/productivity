export const isValid = (v) => {
  return v !== null && v !== undefined;
}

export const isObject = (v) => {
  return typeof(v) === 'object';
}

export const isCallable = (v) => {
  return typeof(v) === 'function';
}

export const smartString = (v) => {
  if( isValid(v) ) {
    return `${v.constructor.name === 'Object' ? JSON.stringify(v) : v}`;
  }
  return `${v}`;
}
