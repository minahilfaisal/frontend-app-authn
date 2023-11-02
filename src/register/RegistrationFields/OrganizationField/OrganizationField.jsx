import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useIntl } from '@edx/frontend-platform/i18n';
import { FormAutosuggest, FormAutosuggestOption, FormControlFeedback } from '@edx/paragon';
import PropTypes from 'prop-types';

import validateOrganizationField, { ORGANIZATION_CODE_KEY, ORGANIZATION_DISPLAY_KEY } from './validator';
import { clearRegistrationBackendError } from '../../data/actions';
import messages from '../../messages';

/**
 * Organization field wrapper. It accepts following handlers
 * - handleChange for setting value change and
 * - handleErrorChange for setting error
 *
 * It is responsible for
 * - Making backend call for getting list of organizations
 * - Performing organization field validations
 * - Clearing error on focus
 * - Setting value on change
 */
const OrganizationField = (props) => {
  const {
    organizationList,
    selectedOrganization,
    onChangeHandler,
    handleErrorChange,
    onFocusHandler,
  } = props;
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const handleOnBlur = (event) => {
    // Do not run validations when drop-down arrow is clicked
    if (event.relatedTarget && event.relatedTarget.className.includes('pgn__form-autosuggest__icon-button')) {
      return;
    }

    const { value } = event.target;

    const { organizationCode, displayValue, error } = validateOrganizationField(
      value.trim(), organizationList, formatMessage(messages['empty.organization.field.error']),
    );

    onChangeHandler({ target: { name: 'organization' } }, null, displayValue );
    handleErrorChange('organization', error);
  };

  const handleSelected = (value) => {
    handleOnBlur({ target: { name: 'organization', value } });
  };

  const handleOnFocus = (event) => {
    handleErrorChange('organization', '');
    dispatch(clearRegistrationBackendError('organization'));
    onFocusHandler(event);
  };

  const handleOnChange = (value) => {
    onChangeHandler({ target: { name: 'organization' } }, null, value );
  };

  const getOrganizationList = () => organizationList.map((organization) => (
    <FormAutosuggestOption key={organization[ORGANIZATION_CODE_KEY]}>
      {organization[ORGANIZATION_DISPLAY_KEY]}
    </FormAutosuggestOption>
  ));

  return (
    <div className="mb-4">
      <FormAutosuggest
        floatingLabel={formatMessage(messages['registration.organization.label'])}
        aria-label="form autosuggest"
        name="organization"
        value={selectedOrganization || ''}
        onSelected={(value) => handleSelected(value)}
        onFocus={(e) => handleOnFocus(e)}
        onBlur={(e) => handleOnBlur(e)}
        onChange={(value) => handleOnChange(value)}
      >
        {getOrganizationList()}
      </FormAutosuggest>
      {props.errorMessage !== '' && (
        <FormControlFeedback
          key="error"
          className="form-text-size"
          hasIcon={false}
          feedback-for="organization"
          type="invalid"
        >
          {props.errorMessage}
        </FormControlFeedback>
      )}
    </div>
  );
};

OrganizationField.propTypes = {
  organizationList: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      name: PropTypes.string,
    }),
  ).isRequired,
  errorMessage: PropTypes.string,
  onChangeHandler: PropTypes.func.isRequired,
  handleErrorChange: PropTypes.func.isRequired,
  onFocusHandler: PropTypes.func.isRequired,
  selectedOrganization: PropTypes.string,
};

OrganizationField.defaultProps = {
  errorMessage: null,
  selectedOrganization: '',
};

export default OrganizationField;
