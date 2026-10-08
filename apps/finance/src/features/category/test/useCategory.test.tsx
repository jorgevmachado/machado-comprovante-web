import { renderHook } from '@testing-library/react';

import { useCategory } from '../hooks/useCategory';

describe('useCategory', () => {
  it('requires a CategoryProvider', () => {
    expect(() => renderHook(() => useCategory())).toThrow(
      'useCategory must be used within a CategoryProvider.',
    );
  });
});
