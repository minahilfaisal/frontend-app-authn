import React from 'react';
import { Provider } from 'react-redux';

import { mergeConfig } from '@edx/frontend-platform';
import { injectIntl, IntlProvider } from '@edx/frontend-platform/i18n';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ORGANIZATION_CODE_KEY, ORGANIZATION_DISPLAY_KEY } from './validator';
import { OrganizationField } from '../index';

const IntlOrganizationField = injectIntl(OrganizationField);
const mockStore = configureStore();

jest.mock('react-router-dom', () => {
  const mockNavigation = jest.fn();

  // eslint-disable-next-line react/prop-types
  const Navigate = ({ to }) => {
    mockNavigation(to);
    return <div />;
  };

  return {
    ...jest.requireActual('react-router-dom'),
    Navigate,
    mockNavigate: mockNavigation,
  };
});

describe('OrganizationField', () => {
  let props = {};
  let store = {};

  const reduxWrapper = children => (
    <IntlProvider locale="en">
      <Provider store={store}>{children}</Provider>
    </IntlProvider>
  );

  const routerWrapper = children => (
    <Router>
      {children}
    </Router>
  );

  const initialState = {
    register: {},
  };

  beforeEach(() => {
    store = mockStore(initialState);
    props = {
      organizationList: [{
        [ORGANIZATION_CODE_KEY]: 'orgX1',
        [ORGANIZATION_DISPLAY_KEY]: 'Demo Org 1',
      }],
      selectedOrganization: {
        organizationCode: '',
        displayValue: '',
      },
      errorMessage: '',
      onChangeHandler: jest.fn(),
      handleErrorChange: jest.fn(),
      onFocusHandler: jest.fn(),
    };
    window.location = { search: '' };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Test Organization Field', () => {
    mergeConfig({
      SHOW_CONFIGURABLE_EDX_FIELDS: true,
    });

    const emptyFieldValidation = {
      organization: 'Select your organization.',
    };

    it('should run organization field validation when onBlur is fired', () => {
      const organizationField = mount(routerWrapper(reduxWrapper(<IntlOrganizationField {...props} />)));
      organizationField.find('input[name="organization"]').simulate('blur', { target: { value: '', name: 'organization' } });
      expect(props.handleErrorChange).toHaveBeenCalledTimes(1);
      expect(props.handleErrorChange).toHaveBeenCalledWith(
        'organization',
        emptyFieldValidation.organization,
      );
    });

    it('should not run organization field validation when onBlur is fired by drop-down arrow icon click', () => {
      const organizationField = mount(routerWrapper(reduxWrapper(<IntlOrganizationField {...props} />)));
      organizationField.find('input[name="organization"]').simulate('blur', {
        target: { value: '', name: 'organization' },
        relatedTarget: { type: 'button', className: 'btn-icon pgn__form-autosuggest__icon-button' },
      });
      expect(props.handleErrorChange).toHaveBeenCalledTimes(0);
    });

    it('should update errors for frontend validations', () => {
      const organizationField = mount(routerWrapper(reduxWrapper(<IntlOrganizationField {...props} />)));

      organizationField.find('input[name="organization"]').simulate('blur', { target: { value: '', name: 'organization' } });
      expect(props.handleErrorChange).toHaveBeenCalledTimes(1);
      expect(props.handleErrorChange).toHaveBeenCalledWith(
        'organization',
        emptyFieldValidation.organization,
      );
    });

    it('should clear error on focus', () => {
      const organizationField = mount(routerWrapper(reduxWrapper(<IntlOrganizationField {...props} />)));

      organizationField.find('input[name="organization"]').simulate('focus', { target: { value: '', name: 'organization' } });
      expect(props.handleErrorChange).toHaveBeenCalledTimes(1);
      expect(props.handleErrorChange).toHaveBeenCalledWith(
        'organization',
        '',
      );
    });

    // it('should update state and store list of organizations in redux store', () => {
    //   store = mockStore({
    //     ...initialState,
    //     register: {
    //       ...initialState.register,
    //       backendOrganizationList: [],
    //     },
    //   });

    //   mount(routerWrapper(reduxWrapper(<IntlOrganizationField {...props} />)));
    //   expect(props.onChangeHandler).toHaveBeenCalledTimes(1);
    //   expect(props.onChangeHandler).toHaveBeenCalledWith(
    //     { target: { name: 'organization' } },
    //     { organizationCode: 'orgX1', displayValue: 'Demo Org 1' },
    //   );
    // });

    it('should set option on dropdown menu item click', () => {
      const organizationField = mount(routerWrapper(reduxWrapper(<IntlOrganizationField {...props} />)));

      organizationField.find('.pgn__form-autosuggest__icon-button').first().simulate('click');
      organizationField.find('.dropdown-item').first().simulate('click');

      expect(props.onChangeHandler).toHaveBeenCalledTimes(1);
      expect(props.onChangeHandler).toHaveBeenCalledWith(
        { target: { name: 'organization' } },
        { organizationCode: 'orgX1', displayValue: 'Demo Org 1' },
      );
    });

    it('should set value on change', () => {
      const organizationField = mount(routerWrapper(reduxWrapper(<IntlOrganizationField {...props} />)));

      organizationField.find('input[name="organization"]').simulate(
        'change', { target: { value: 'Demo Org 1', name: 'organization' } },
      );

      expect(props.onChangeHandler).toHaveBeenCalledTimes(1);
      expect(props.onChangeHandler).toHaveBeenCalledWith(
        { target: { name: 'organization' } },
        { organizationCode: '', displayValue: 'Demo Org 1' },
      );
    });

    // it('should display error on invalid organization input', () => {
    //   props = {
    //     ...props,
    //     errorMessage: 'organization error message',
    //   };

    //   const organizationField = mount(routerWrapper(reduxWrapper(<IntlOrganizationField {...props} />)));

    //   expect(organizationField.find('div[feedback-for="organization"]').text()).toEqual('organization error message');
    // });
  });
});
