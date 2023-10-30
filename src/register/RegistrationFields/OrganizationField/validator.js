export const ORGANIZATION_CODE_KEY = 'code';
export const ORGANIZATION_DISPLAY_KEY = 'name';

const validateOrganizationField = (value, organizationList, errorMessage) => {
  let organizationCode = '';
  let displayValue = value;
  let error = errorMessage;

  if (displayValue.trim()) { // if value is not empty, remove error
    error = '';
  }
  return { error, organizationCode, displayValue };
};

export default validateOrganizationField;