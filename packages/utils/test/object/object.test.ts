import { describe, expect, it } from '@jest/globals';

import { isObject} from '../../src'

describe('Object function', () => {
  const mockList = [
    { id: '1', name: 'John Doe', name_code: 'john_doe' },
    { id: '2', name: 'Jane Smith', name_code: 'jane_smith' },
    { id: '3', name: 'Alice Johnson', name_code: 'alice_johnson' },
  ];
  describe('isObject', () => {
    it('should return true when param is a object', () => {
      expect(isObject(mockList[0])).toBeTruthy();
    });

    it('should return false when param is not a valid object', () => {
      expect(isObject('not-object')).toBeFalsy();
    });
  });
});