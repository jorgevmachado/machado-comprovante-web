import { describe, expect, it } from '@jest/globals';

import { validateValue, objectHasKey, getObjectValue } from '../../src'

describe('Entity functions', () => {
  describe('validateValue', () => {
    describe('when type is string', () => {
      it('should return the string value', () => {
        expect(
          validateValue({
            type: 'string',
            value: 'Jorge',
          }),
        ).toBe('Jorge');
      });

      it('should return the string defaultValue when value is invalid', () => {
        expect(
          validateValue({
            type: 'string',
            value: undefined,
            defaultValue: 'default',
          }),
        ).toBe('default');
      });

      it('should return the function default value when defaultValue is not a string', () => {
        expect(
          validateValue({
            type: 'string',
            value: undefined,
            defaultValue: 10,
          }),
        ).toBe('unknown');
      });

      it('should return the function default value when defaultValue is not provided', () => {
        expect(
          validateValue({
            type: 'string',
            value: undefined,
          }),
        ).toBe('unknown');
      });

      it('should return the defaultValue when value is a number', () => {
        expect(
          validateValue({
            type: 'string',
            value: 10,
            defaultValue: 'default',
          }),
        ).toBe('default');
      });

      it('should return the defaultValue when value is an empty string', () => {
        expect(
          validateValue({
            type: 'string',
            value: '',
            defaultValue: 'default',
          }),
        ).toBe('default');
      });

      it('should use string as the default type', () => {
        expect(
          validateValue({
            value: 'Jorge',
          }),
        ).toBe('Jorge');
      });
    });

    describe('when type is number', () => {
      it('should return the number value', () => {
        expect(
          validateValue({
            type: 'number',
            value: 10,
          }),
        ).toBe(10);
      });

      it('should return the number defaultValue when value is invalid', () => {
        expect(
          validateValue({
            type: 'number',
            value: undefined,
            defaultValue: 20,
          }),
        ).toBe(20);
      });

      it('should return zero when defaultValue is not a number', () => {
        expect(
          validateValue({
            type: 'number',
            value: undefined,
            defaultValue: 'default',
          }),
        ).toBe(0);
      });

      it('should return zero when defaultValue is not provided', () => {
        expect(
          validateValue({
            type: 'number',
            value: undefined,
          }),
        ).toBe(0);
      });

      it('should return the defaultValue when value is a string', () => {
        expect(
          validateValue({
            type: 'number',
            value: '10',
            defaultValue: 20,
          }),
        ).toBe(20);
      });

      it('should return zero when value is zero', () => {
        expect(
          validateValue({
            type: 'number',
            value: 0,
            defaultValue: 20,
          }),
        ).toBe(20);
      });
    });

    describe('when type is invalid', () => {
      it('should return unknown', () => {
        expect(
          validateValue({
            type: 'invalid' as 'string',
            value: 'Jorge',
          }),
        ).toBe('unknown');
      });
    });
  });

  describe('objectHasKey', () => {
    it('should return true when object contains the key', () => {
      const object = {
        name: 'Jorge',
      };

      expect(objectHasKey(object, 'name')).toBeTruthy();
    });

    it('should return false when object does not contain the key', () => {
      const object = {
        name: 'Jorge',
      };

      expect(objectHasKey(object, 'email')).toBeFalsy();
    });

    it('should return false when object is null', () => {
      expect(objectHasKey(null, 'name')).toBeFalsy();
    });

    it('should return false when object is undefined', () => {
      expect(objectHasKey(undefined, 'name')).toBeFalsy();
    });

    it('should return false when value is a string', () => {
      expect(objectHasKey('Jorge', 'name')).toBeFalsy();
    });

    it('should return false when value is a number', () => {
      expect(objectHasKey(10, 'name')).toBeFalsy();
    });

    it('should return true when key exists with undefined value', () => {
      const object = {
        name: undefined,
      };

      expect(objectHasKey(object, 'name')).toBeTruthy();
    });
  });

  describe('getObjectValue', () => {
    describe('when object contains the key', () => {
      it('should return a string value', () => {
        const object = {
          name: 'Jorge',
        };

        expect(
          getObjectValue({
            obj: object,
            key: 'name',
          }),
        ).toBe('Jorge');
      });

      it('should return a number value as a string when type is number', () => {
        const object = {
          age: 30,
        };

        expect(
          getObjectValue({
            obj: object,
            key: 'age',
            type: 'number',
          }),
        ).toBe('30');
      });

      it('should use string as the default type', () => {
        const object = {
          name: 'Jorge',
        };

        expect(
          getObjectValue({
            obj: object,
            key: 'name',
          }),
        ).toBe('Jorge');
      });

      it('should return the string defaultValue when the value is invalid', () => {
        const object = {
          name: undefined,
        };

        expect(
          getObjectValue({
            obj: object,
            key: 'name',
            defaultValue: 'Unknown',
          }),
        ).toBe('Unknown');
      });

      it('should return the number defaultValue when the value is invalid', () => {
        const object = {
          age: undefined,
        };

        expect(
          getObjectValue({
            obj: object,
            key: 'age',
            type: 'number',
            defaultValue: 18,
          }),
        ).toBe('18');
      });

      it('should return zero when number value is invalid and no defaultValue is provided', () => {
        const object = {
          age: undefined,
        };

        expect(
          getObjectValue({
            obj: object,
            key: 'age',
            type: 'number',
          }),
        ).toBe('0');
      });
    });

    describe('when object does not contain the key', () => {
      it('should return an empty string', () => {
        const object = {
          name: 'Jorge',
        };

        expect(
          getObjectValue({
            obj: object,
            key: 'email',
          }),
        ).toBe('');
      });

      it('should return an empty string even when defaultValue is provided', () => {
        const object = {
          name: 'Jorge',
        };

        expect(
          getObjectValue({
            obj: object,
            key: 'email',
            defaultValue: 'Unknown',
          }),
        ).toBe('');
      });
    });

    describe('when object is invalid', () => {
      it('should return an empty string when object is null', () => {
        expect(
          getObjectValue({
            obj: null,
            key: 'name',
          }),
        ).toBe('');
      });

      it('should return an empty string when object is undefined', () => {
        expect(
          getObjectValue({
            obj: undefined,
            key: 'name',
          }),
        ).toBe('');
      });

      it('should return an empty string when object is a primitive value', () => {
        expect(
          getObjectValue({
            obj: 'Jorge',
            key: 'name',
          }),
        ).toBe('');
      });
    });

    describe('when value has an incompatible type', () => {
      it('should use the string defaultValue when type is string and value is a number', () => {
        const object = {
          name: 123,
        };

        expect(
          getObjectValue({
            obj: object,
            key: 'name',
            type: 'string',
            defaultValue: 'Unknown',
          }),
        ).toBe('Unknown');
      });

      it('should use the number defaultValue when type is number and value is a string', () => {
        const object = {
          age: '30',
        };

        expect(
          getObjectValue({
            obj: object,
            key: 'age',
            type: 'number',
            defaultValue: 18,
          }),
        ).toBe('18');
      });
    });
  });
});



