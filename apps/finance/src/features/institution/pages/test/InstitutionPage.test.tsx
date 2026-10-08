import { render } from '@testing-library/react';

import InstitutionPage from '../InstitutionPage';
import { InstitutionList } from '../../components';

jest.mock('../../components', () => ({
  InstitutionList: jest.fn(() => null),
}));

describe('InstitutionPage', () => {
  it.each(['source', 'destination'] as const)('forwards the institution type %s', (type) => {
    render(<InstitutionPage type={type} />);

    expect(jest.mocked(InstitutionList)).toHaveBeenCalledWith({ type }, undefined);
  });
});
