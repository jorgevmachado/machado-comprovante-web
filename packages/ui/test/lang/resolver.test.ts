import React from 'react';
import { renderHook } from '@testing-library/react';
import {
  isTranslationValue ,
  parseTranslationMessage ,
  useAppTranslation ,
} from '@machado-repo/i18n';
import { useTranslationResolver } from '../../src';

jest.mock('@machado-repo/i18n' ,() => ({
  useAppTranslation: jest.fn() ,
  isTranslationValue: jest.fn() ,
  parseTranslationMessage: jest.fn() ,
}));

describe('useTranslationResolver' ,() => {
  const t = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppTranslation as jest.Mock).mockReturnValue({ t  });
  });
  describe('resolve', () => {
    describe('non translation value' ,() => {
      it('should return the original value' ,() => {
        (isTranslationValue as jest.Mock).mockReturnValue(false);
        const { result } = renderHook(() => useTranslationResolver());
        const value = 'Nome';
        const resolved = result.current.resolve(value);
        expect(resolved).toBe(value);
        expect(t).not.toHaveBeenCalled();
        expect(parseTranslationMessage).not.toHaveBeenCalled();
      });
      it('should return undefined when the value is not defined' ,() => {
        (isTranslationValue as jest.Mock).mockReturnValue(false);
        const { result } = renderHook(() => useTranslationResolver());
        const resolved = result.current.resolve(undefined);
        expect(resolved).toBeUndefined();
        expect(t).not.toHaveBeenCalled();
        expect(parseTranslationMessage).not.toHaveBeenCalled();
      });
      it('should return null when the value is null' ,() => {
        (isTranslationValue as jest.Mock).mockReturnValue(false);
        const { result } = renderHook(() => useTranslationResolver());
        const resolved = result.current.resolve(null);
        expect(resolved).toBeNull();
        expect(t).not.toHaveBeenCalled();
        expect(parseTranslationMessage).not.toHaveBeenCalled();
      });
    });
    describe('translation value' ,() => {
      it('should translate a simple translation key' ,() => {
        (isTranslationValue as jest.Mock).mockReturnValue(true);
        (parseTranslationMessage as jest.Mock).mockReturnValue(null);
        t.mockReturnValue('Nome');
        const { result } = renderHook(() => useTranslationResolver());
        const value = 'form.label.name';
        const resolved = result.current.resolve(value);
        expect(isTranslationValue).toHaveBeenCalledWith(value);
        expect(parseTranslationMessage).toHaveBeenCalledWith(value);
        expect(t).toHaveBeenCalledWith(value ,undefined);
        expect(resolved).toBe('Nome');
      });
      it('should translate a simple translation key using values' ,() => {
        (isTranslationValue as jest.Mock).mockReturnValue(true);
        (parseTranslationMessage as jest.Mock).mockReturnValue(null);
        t.mockReturnValue('Olá, Jorge');
        const { result } = renderHook(() => useTranslationResolver());
        const value = 'form.greeting';
        const values = { name: 'Jorge'  };
        const resolved = result.current.resolve(value ,values);
        expect(isTranslationValue).toHaveBeenCalledWith(value);
        expect(parseTranslationMessage).toHaveBeenCalledWith(value);
        expect(t).toHaveBeenCalledWith(value ,values);
        expect(resolved).toBe('Olá, Jorge');
      });
      it('should translate a value with parsed parameters' ,() => {
        (isTranslationValue as jest.Mock).mockReturnValue(true);
        const parsedValue = {
          key: 'form.validation.password.invalid.min_length' ,
          params: { min: 8  } ,
        };
        (parseTranslationMessage as jest.Mock).mockReturnValue(parsedValue );
        t.mockReturnValue('A senha deve possuir no mínimo 8 caracteres' );
        const { result } = renderHook(() => useTranslationResolver());
        const value = '\'form.validation.password.invalid.min_length\', { min: 8 }';
        const resolved = result.current.resolve(value);
        expect(isTranslationValue).toHaveBeenCalledWith(value);
        expect(parseTranslationMessage).toHaveBeenCalledWith(value);
        expect(t).toHaveBeenCalledWith(parsedValue.key ,parsedValue.params );
        expect(resolved).toBe('A senha deve possuir no mínimo 8 caracteres' );
      });
      it('should merge parsed parameters with values' ,() => {
        (isTranslationValue as jest.Mock).mockReturnValue(true);
        const parsedValue = {
          key: 'form.validation.password.invalid.min_length' ,
          params: { min: 8  } ,
        };
        (parseTranslationMessage as jest.Mock).mockReturnValue(parsedValue );
        t.mockReturnValue('A senha deve possuir no mínimo 8 caracteres' );
        const { result } = renderHook(() => useTranslationResolver());
        const value = '\'form.validation.password.invalid.min_length\', { min: 8 }';
        const values = { field: 'password'  };
        const resolved = result.current.resolve(value ,values);
        expect(t).
        toHaveBeenCalledWith(parsedValue.key ,{ min: 8 ,field: 'password'  } );
        expect(resolved).toBe('A senha deve possuir no mínimo 8 caracteres' );
      });
      it('should allow values to override parsed parameters' ,() => {
        (isTranslationValue as jest.Mock).mockReturnValue(true);
        const parsedValue = {
          key: 'form.validation.invalid' ,
          params: { min: 8 ,max: 20  } ,
        };
        (parseTranslationMessage as jest.Mock).mockReturnValue(parsedValue );
        t.mockReturnValue('Mensagem traduzida');
        const { result } = renderHook(() => useTranslationResolver());
        const value = '\'form.validation.invalid\', { min: 8, max: 20 }';
        const values = { min: 10  };
        const resolved = result.current.resolve(value ,values);
        expect(t).toHaveBeenCalledWith(parsedValue.key ,{ min: 10 ,max: 20  } );
        expect(resolved).toBe('Mensagem traduzida');
      });
      it('should translate using values when the message cannot be parsed' ,
        () => {
          (isTranslationValue as jest.Mock).mockReturnValue(true);
          (parseTranslationMessage as jest.Mock).mockReturnValue(null);
          t.mockReturnValue('Mensagem traduzida');
          const { result } = renderHook(() => useTranslationResolver());
          const value = 'form.message';
          const values = { name: 'Jorge'  };
          const resolved = result.current.resolve(value ,values);
          expect(parseTranslationMessage).toHaveBeenCalledWith(value);
          expect(t).toHaveBeenCalledWith(value ,values );
          expect(resolved).toBe('Mensagem traduzida');
        });
      it('should pass undefined values when no values are provided' ,() => {
        (isTranslationValue as jest.Mock).mockReturnValue(true);
        (parseTranslationMessage as jest.Mock).mockReturnValue(null);
        t.mockReturnValue('Nome');
        const { result } = renderHook(() => useTranslationResolver());
        const value = 'form.label.name';
        result.current.resolve(value);
        expect(t).toHaveBeenCalledWith(value ,undefined );
      });
    });
    describe('resolver stability' ,() => {
      it(
        'should preserve the resolver reference when translation function does not change' ,
        () => {
          (isTranslationValue as jest.Mock).mockReturnValue(false);
          const { result ,rerender } = renderHook(
            () => useTranslationResolver() );
          const firstResolver = result.current.resolve;
          rerender();
          expect(result.current.resolve).toBe(firstResolver);
        });
      it('should create a new resolver when translation function changes' ,() => {
        (isTranslationValue as jest.Mock).mockReturnValue(false);
        const firstTranslation = jest.fn();
        const secondTranslation = jest.fn();
        (useAppTranslation as jest.Mock).mockReturnValueOnce(
          { t: firstTranslation  }).
        mockReturnValueOnce({ t: secondTranslation  });
        const { result ,rerender } = renderHook(() => useTranslationResolver() );
        const firstResolver = result.current.resolve;
        rerender();
        expect(result.current.resolve).not.toBe(firstResolver);
      });
    });
  });

  describe('resolveChildren' ,() => {
    it('should resolve a string child' ,() => {
      (isTranslationValue as jest.Mock).mockReturnValue(true);
      (parseTranslationMessage as jest.Mock).mockReturnValue(null);
      t.mockReturnValue('translated:Save');
      const { result } = renderHook(() => useTranslationResolver());
      const resolved = result.current.resolveChildren('Save' ,1);
      expect(resolved).toBe('translated:Save');
      expect(isTranslationValue).toHaveBeenCalledWith('Save');
      expect(parseTranslationMessage).toHaveBeenCalledWith('Save');
      expect(t).toHaveBeenCalledWith('Save' ,undefined);
    });
    it('should resolve a string child using the default depth' ,() => {
      (isTranslationValue as jest.Mock).mockReturnValue(true);
      (parseTranslationMessage as jest.Mock).mockReturnValue(null);
      t.mockReturnValue('translated:Save');
      const { result } = renderHook(() => useTranslationResolver());
      const resolved = result.current.resolveChildren('Save');
      expect(resolved).toBe('translated:Save');
      expect(t).toHaveBeenCalledWith('Save' ,undefined);
    });
    it('should return the child when depth is zero' ,() => {
      const child = React.createElement('span' ,null ,'Save' );
      const { result } = renderHook(() => useTranslationResolver());
      const resolved = result.current.resolveChildren(child ,0);
      expect(resolved).toBe(child);
      expect(t).not.toHaveBeenCalled();
      expect(isTranslationValue).not.toHaveBeenCalled();
      expect(parseTranslationMessage).not.toHaveBeenCalled();
    });
    it('should return the child when depth is negative' ,() => {
      const child = React.createElement('span' ,null ,'Save' );
      const { result } = renderHook(() => useTranslationResolver());
      const resolved = result.current.resolveChildren(child ,-1);
      expect(resolved).toBe(child);
      expect(t).not.toHaveBeenCalled();
      expect(isTranslationValue).not.toHaveBeenCalled();
      expect(parseTranslationMessage).not.toHaveBeenCalled();
    });
    it('should return non-element children unchanged' ,() => {
      const { result } = renderHook(() => useTranslationResolver());
      expect(result.current.resolveChildren(null ,1)).toBeNull();
      expect(result.current.resolveChildren(undefined ,1)).toBeUndefined();
      expect(result.current.resolveChildren(123 ,1)).toBe(123);
      expect(result.current.resolveChildren(false ,1)).toBe(false);
      expect(t).not.toHaveBeenCalled();
    });
    it('should resolve a string child inside an element when depth allows it' ,
      () => {
        (isTranslationValue as jest.Mock).mockReturnValue(true);
        (parseTranslationMessage as jest.Mock).mockReturnValue(null);
        t.mockImplementation(value => `translated:${ value }` );
        const child = React.createElement('span' ,null ,'Save' );
        const { result } = renderHook(() => useTranslationResolver());
        const resolved = result.current.resolveChildren(child ,2);
        expect(React.isValidElement(resolved)).toBe(true);
        const children = React.Children.toArray(
          (resolved as React.ReactElement).props.children );
        expect(children).toEqual(['translated:Save']);
        expect(t).toHaveBeenCalledTimes(1);
        expect(t).toHaveBeenCalledWith('Save' ,undefined);
      });
    it('should resolve multiple string children within the specified depth' ,
      () => {
        (isTranslationValue as jest.Mock).mockReturnValue(true);
        (parseTranslationMessage as jest.Mock).mockReturnValue(null);
        t.mockImplementation(value => `translated:${ value }` );
        const child = React.createElement('div' ,null ,
          React.createElement('span' ,null ,'Save') ,
          React.createElement('span' ,null ,'Cancel') );
        const { result } = renderHook(() => useTranslationResolver());
        const resolved = result.current.resolveChildren(child ,2);
        expect(React.isValidElement(resolved)).toBe(true);
        const children = React.Children.toArray(
          (resolved as React.ReactElement).props.children );
        const firstChild = children[0] as React.ReactElement;
        const secondChild = children[1] as React.ReactElement;
        expect(firstChild.props.children).toEqual(['translated:Save' ]);
        expect(secondChild.props.children).toEqual(['translated:Cancel' ]);
        expect(t).toHaveBeenCalledTimes(2);
        expect(t).toHaveBeenNthCalledWith(1 ,'Save' ,undefined );
        expect(t).toHaveBeenNthCalledWith(2 ,'Cancel' ,undefined );
      });
    it('should resolve nested children according to depth' ,() => {
      (isTranslationValue as jest.Mock).mockReturnValue(true);
      (parseTranslationMessage as jest.Mock).mockReturnValue(null);
      t.mockImplementation(value => `translated:${ value }` );
      const child = React.createElement('div' ,null ,
        React.createElement('span' ,null ,
          React.createElement('strong' ,null ,'Save' ) ) );
      const { result } = renderHook(() => useTranslationResolver());
      const resolved = result.current.resolveChildren(child ,3);
      expect(React.isValidElement(resolved)).toBe(true);
      const rootChildren = React.Children.toArray(
        (resolved as React.ReactElement).props.children );
      const span = rootChildren[0] as React.ReactElement;
      const spanChildren = React.Children.toArray(span.props.children );
      const strong = spanChildren[0] as React.ReactElement;
      const strongChildren = React.Children.toArray(strong.props.children );
      expect(strongChildren).toEqual(['translated:Save' ]);
      expect(t).toHaveBeenCalledTimes(1);
      expect(t).toHaveBeenCalledWith('Save' ,undefined );
    });
    it('should not resolve children beyond the specified depth' ,() => {
      (isTranslationValue as jest.Mock).mockReturnValue(true);
      (parseTranslationMessage as jest.Mock).mockReturnValue(null);
      t.mockImplementation(value => `translated:${ value }` );
      const child = React.createElement('div' ,null ,
        React.createElement('span' ,null ,
          React.createElement('strong' ,null ,'Save' ) ) );
      const { result } = renderHook(() => useTranslationResolver());
      const resolved = result.current.resolveChildren(child ,2);
      expect(React.isValidElement(resolved)).toBe(true);
      const rootChildren = React.Children.toArray(
        (resolved as React.ReactElement).props.children );
      const span = rootChildren[0] as React.ReactElement;
      const spanChildren = React.Children.toArray(span.props.children );
      const strong = spanChildren[0] as React.ReactElement;
      expect(strong.props.children).toBe('Save');
      expect(t).not.toHaveBeenCalled();
      expect(isTranslationValue).not.toHaveBeenCalled();
      expect(parseTranslationMessage).not.toHaveBeenCalled();
    });
    it('should preserve non-element nested children' ,() => {
      (isTranslationValue as jest.Mock).mockReturnValue(false);
      const child = React.createElement('div' ,null ,'Save' ,123 ,null );
      const { result } = renderHook(() => useTranslationResolver());
      const resolved = result.current.resolveChildren(child ,1);
      expect(React.isValidElement(resolved)).toBe(true);
      const children = React.Children.toArray(
        (resolved as React.ReactElement).props.children );
      expect(children[0]).toBe('Save');
      expect(children[1]).toBe(123);
      expect(t).not.toHaveBeenCalled();
    });
    it('should preserve the original element properties' ,() => {
      (isTranslationValue as jest.Mock).mockReturnValue(true);
      (parseTranslationMessage as jest.Mock).mockReturnValue(null);
      t.mockReturnValue('translated:Save');
      const child = React.createElement('div' ,
        { className: 'content' ,'data-testid': 'content'  } ,'Save' );
      const { result } = renderHook(() => useTranslationResolver());
      const resolved = result.current.resolveChildren(child ,1);
      expect(React.isValidElement(resolved)).toBe(true);
      expect((resolved as React.ReactElement).props.className ).
      toBe('content');
      expect((resolved as React.ReactElement).props['data-testid'] ).
      toBe('content');
      expect((resolved as React.ReactElement).props.children ).
      toEqual(['translated:Save']);
    });
  });
});