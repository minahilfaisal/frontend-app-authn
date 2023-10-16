import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useIntl } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';

import validateOrganization from './validator';
import { FormGroup } from '../../../common-components';
import { clearRegistrationBackendError, fetchRealtimeValidations } from '../../data/actions';

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
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const validationApiRateLimited = useSelector(state => state.register.validationApiRateLimited);

  const {
    handleErrorChange,
    shouldFetchOrganizationList,
  } = props;

  const handleOnBlur = (e) => {
    const { value } = e.target;
    // MYTODO: validation function 
    const fieldError = validateOrganization(value, formatMessage);
    if (fieldError) {
      handleErrorChange('organization', fieldError);
    } else if (shouldFetchOrganizationList && !validationApiRateLimited) {
      dispatch(fetchRealtimeValidations({ organization: value }));
    }
  };

  const handleOnFocus = () => {
    handleErrorChange('organization', '');
    dispatch(clearRegistrationBackendError('organization'));
  };

  return (
    <FormGroup
      {...props}
      handleBlur={handleOnBlur}
      handleFocus={handleOnFocus}
    />
  );
};

OrganizationField.defaultProps = {
  errorMessage: '',
  shouldFetchOrganizationList: false,
};

OrganizationField.propTypes = {
  errorMessage: PropTypes.string,
  shouldFetchOrganizationList: PropTypes.bool,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleErrorChange: PropTypes.func.isRequired,
};

export default OrganizationField;
