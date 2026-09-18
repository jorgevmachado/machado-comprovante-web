'use client';
import { useActionState } from 'react';
import { Form, FORM_INITIAL_ACTION_STATE, type FormActionState } from '@machado-repo/ui';


const loginAction = async (actionState: FormActionState, formData: globalThis.FormData): Promise<FormActionState> => {
  console.log('# => loginAction => actionState => ', actionState);
  const value = formData.get('email');
  console.log('# => loginAction => value => ', value);
  return {
    type: 'other',
    status: 'success',
    message: 'Login successful',
  }
}

export default function Login() {
  const [state, formAction, isPending] = useActionState(loginAction, FORM_INITIAL_ACTION_STATE);
  return (
    <div>
      <h1>Login Page</h1>
      <Form
        action={formAction}
        inputs={[
        { name: 'email'},
        { name: 'name' },
        { name: 'password'},
      ]} className="space-y-4" />
    </div>
  );
}
// 036.928.471-22