export const ORGANIZATION_CODE_KEY = 'code';
export const ORGANIZATION_DISPLAY_KEY = 'name';

const validateOrganizationField = (value, organizationList, errorMessage) => {
  let organizationCode = '';
  let displayValue = value;
  let error = errorMessage;

  if (value) {
    const normalizedValue = value.toLowerCase();
    // Handling a case here where user enters a valid organization code that needs to be
    // evaluated and set its value as a valid value.
    const selectedOrganization = organizationList.find(
      (organization) => (
        // When translations are applied, extra space added in organization value, so we should trim that.
        organization[ORGANIZATION_DISPLAY_KEY].toLowerCase().trim() === normalizedValue
        || organization[ORGANIZATION_CODE_KEY].toLowerCase().trim() === normalizedValue
      ),
    );
    if (selectedOrganization) {
      organizationCode = selectedOrganization[ORGANIZATION_CODE_KEY];
      displayValue = selectedOrganization[ORGANIZATION_DISPLAY_KEY];
      error = '';
    }
  }
  return { error, organizationCode, displayValue };
};

export default validateOrganizationField;