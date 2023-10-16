import messages from '../../messages';

const validateOrganization = (value, formatMessage) => {
  let fieldError;
  if (!value.trim()) {
    fieldError = formatMessage(messages['empty.organization.field.error']);
  }
  return fieldError;
};

export default validateOrganization;
