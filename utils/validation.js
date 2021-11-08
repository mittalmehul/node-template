const REQUIRED = 'required';
const SIZE = 'size';

function getValidationMap(params) {
  const {
    fieldName, type, isRequired, size,
  } = params;

  const ruleList = [];
  if (isRequired) {
    ruleList.push(REQUIRED);
  }
  if (type) {
    ruleList.push(type);
  }

  if (size) {
    ruleList.push(`${SIZE}:${size}`);
  }
  const validationMap = {
    field: fieldName,
    rules: ruleList,
  };
  return validationMap;
}

module.exports = {
  getValidationMap,
};
