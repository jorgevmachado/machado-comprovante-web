'use client';
import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

import { Button, Text, Lang, Form, useAlert, type FormProps, type FormValidation } from '@machado-repo/ui';

import { setAuthCookie } from '../session';

import {
  loginAction ,
  registerAction ,
} from '@/app/modules/auth/actions';

type AuthMode = 'register' | 'login';

const FORM: Record<string, FormProps> = {
  login: {
    fields: [
      { type: 'text', name: 'mode', value: 'login', hidden: true },
      { type: 'email'},
      { type: 'password'},
    ],
    actions: {
      submit: {
        children: 'auth.login.submit',
        fullWidth: true
      },
      justify: 'center',
    },
    layout: undefined,
    initialValues: {
      email: '',
      password: '',
    }
  },
  register: {
    fields: [
      { type: 'text', name: 'mode', value: 'register', hidden: true },
      { type: 'fullname' },
      { type: 'text', name: 'username', label: 'auth.form.username.label', placeholder: 'auth.form.username.placeholder'},
      { type: 'email' },
      { type: 'description', presentation: { rows: 5, minLength: 10, maxLength: 200, showCharacterCount: true }},
      { type: 'password'},
      { type: 'password_confirmation'},
    ],
    actions: {
      submit: {
        children: 'auth.register.submit',
        fullWidth: true
      },
      justify: 'center',
    },
    layout: {
      cols: 2,
      fields: [
        { name: 'fullname', span: 2 },
        { name: 'username', span: 1 },
        { name: 'email', span: 1 },
        { name: 'description', span: 2 },
        { name: 'password', span: 1 },
        { name: 'password_confirmation', span: 1 },
      ]
    },
    initialValues: {
      fullname: '',
      username: '',
      email: '',
      description: '',
      password: '',
      confirm_password: '',
    }
  },
}

export default function JoinPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const modeParam = searchParams.get('mode');
  const authMode: AuthMode = (!modeParam || (modeParam !== 'login' && modeParam !== 'register')) ? 'login' : modeParam;

  const { showAlert } = useAlert();

  const [mode, setMode] = useState<AuthMode>(authMode);

  const handleModeChange = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    const newMode = mode === 'login' ? 'register' : 'login';
    setMode(newMode);

    params.set('mode', newMode);
    router.push(`${pathname}?${params.toString()}`);
  }, [mode]);

  const handleOnSuccess = useCallback(async (data: Record<string, string>) => {
    console.log('# => handeOnSuccess => data => ', data)
    const result = {
      variant: 'success',
      message: '',
      position: 'top-right',
    }
    if(mode === 'register') {
      const { status, message } = await registerAction(data);
      result.message = message;
      result.variant = status === 'success' ? 'success' : 'error';
      showAlert(result);
    }

    if(mode === 'login') {
      const { status, message } = await loginAction(data);
      console.log('# => message => ', message);
      result.message = message;
      result.variant = status === 'success' ? 'success' : 'error';
      showAlert(result);
    }
  }, []);

  const handleOnError = useCallback((validation: FormValidation) => {
    showAlert({
      variant: 'error',
      message: validation.errorMessage ?? 'auth.form.validation.error',
      position: 'top-right',
    })
  }, []);

  const formProps: FormProps = useMemo(() => {
    const props = FORM[mode];
    return {
      ...props,
      onSuccess: handleOnSuccess,
      onError: handleOnError,
    }
  }, [mode, handleOnSuccess, handleOnError]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <Text weight="bold" size="2xl" color="text-gray-900" className="mb-2">
          <Lang langKey={`auth.${mode}.title`} />
        </Text>
        <Text size="sm" color="text-gray-500" className="mb-6">
          <Lang langKey={`auth.${mode}.subtitle`} />
        </Text>
        <Form {...formProps} className="space-y-4" />
        <Text size="sm" color="text-gray-500" className="text-center">
          <Lang langKey={`auth.${mode}.link.title`} />
          <Button appearance="outlineBorderless" onClick={handleModeChange}>
            <Lang langKey={`auth.${mode}.link.subtitle`} />
          </Button>
        </Text>
      </div>
    </div>
  )
}