import { render } from '@testing-library/react';
import { Form, useAlert, type FormProps } from '@machado-repo/ui';

import BeneficiaryForm from '../beneficiary/components/form/BeneficiaryForm';
import CategoryForm from '../category/components/form/CategoryForm';
import InstitutionForm from '../institution/components/form/InstitutionForm';
import PayerForm from '../payer/components/form/PayerForm';
import { Beneficiary } from '../beneficiary/domain/Beneficiary';
import { Category } from '../category/domain/Category';
import { Institution } from '../institution/domain/Institution';
import { Payer } from '../payer/domain/Payer';

jest.mock('@machado-repo/ui', () => ({
  Form: jest.fn(() => null),
  useAlert: jest.fn(() => ({ showAlert: jest.fn() })),
}));

const date = new Date('2026-10-08T10:00:00.000Z');

function lastFormProps(): FormProps {
  const props = jest.mocked(Form).mock.calls.at(-1)?.[0];
  if (!props) {
    throw new Error('Expected a rendered form.');
  }
  return props;
}

describe('feature forms', () => {
  const onCancel = jest.fn();
  const onSubmit = jest.fn();

  afterEach(() => jest.clearAllMocks());

  it.each([
    ['beneficiary', BeneficiaryForm, Beneficiary.create({
      id: 'beneficiary-1',
      name: 'Example beneficiary',
      created_at: date,
    })],
    ['institution', InstitutionForm, Institution.create({
      id: 'institution-1',
      name: 'Example institution',
      created_at: date,
    })],
    ['payer', PayerForm, Payer.create({
      id: 'payer-1',
      name: 'Example payer',
      created_at: date,
    })],
  ] as const)('%s form handles create, edit, cancel and validation', (_name, Component, item) => {
    render(<Component onCancel={onCancel} onSubmit={onSubmit} />);
    let props = lastFormProps();

    expect(props.initialValues).toEqual({ name: '' });
    props.onSuccess?.({ name: 'New name' });
    expect(onSubmit).toHaveBeenLastCalledWith({ id: undefined, name: 'New name' });
    props.actions?.cancel?.onClick?.(
      {} as React.MouseEvent<HTMLButtonElement>,
    );
    expect(onCancel).toHaveBeenCalledTimes(1);

    render(<Component item={item} onCancel={onCancel} onSubmit={onSubmit} />);
    props = lastFormProps();
    expect(props.initialValues).toEqual({ name: item.name });
    props.onSuccess?.({});
    expect(onSubmit).toHaveBeenLastCalledWith({ id: item.id, name: '' });
    props.onError?.({ isInvalid: true, fields: {}, errorMessage: 'Invalid form' });
    const showAlert = jest.mocked(useAlert).mock.results.at(-1)?.value.showAlert;
    expect(showAlert).toHaveBeenCalledWith({
      variant: 'error',
      message: 'Invalid form',
      position: 'top-right',
    });
    props.onError?.({ isInvalid: false, fields: {} });
    expect(showAlert).toHaveBeenLastCalledWith({
      variant: 'error',
      message: 'auth.form.validation.error',
      position: 'top-right',
    });
  });

  it('maps category name and description for create and edit forms', () => {
    render(<CategoryForm onCancel={onCancel} onSubmit={onSubmit} />);
    let props = lastFormProps();
    expect(props.initialValues).toEqual({ name: '', description: '' });
    props.onSuccess?.({ name: 'New category' });
    expect(onSubmit).toHaveBeenLastCalledWith({
      id: undefined,
      name: 'New category',
      description: undefined,
    });
    props.actions?.cancel?.onClick?.(
      {} as React.MouseEvent<HTMLButtonElement>,
    );
    expect(onCancel).toHaveBeenCalledTimes(1);

    const category = Category.create({
      id: 'category-1',
      name: 'Utilities',
      description: 'Monthly bills',
      created_at: date,
    });
    render(<CategoryForm item={category} onCancel={onCancel} onSubmit={onSubmit} />);
    props = lastFormProps();
    expect(props.initialValues).toEqual({
      name: 'Utilities',
      description: 'Monthly bills',
    });
    props.onSuccess?.({ name: 'Updated', description: 'Updated description' });
    expect(onSubmit).toHaveBeenLastCalledWith({
      id: category.id,
      name: 'Updated',
      description: 'Updated description',
    });
    props.onError?.({ isInvalid: false, fields: {} });
    const showAlert = jest.mocked(useAlert).mock.results.at(-1)?.value.showAlert;
    expect(showAlert).toHaveBeenCalledWith(expect.objectContaining({
      message: 'auth.form.validation.error',
    }));
  });
});
