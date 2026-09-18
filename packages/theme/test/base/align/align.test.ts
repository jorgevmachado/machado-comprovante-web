import { type TAlign ,TEXT_ALIGN_CLASS_MAP, OAlign  } from '../../../src';

describe('align', () => {
  it('should map align values to class names', () => {
    (Object.keys(TEXT_ALIGN_CLASS_MAP) as TAlign[]).forEach((align) => {
      expect(TEXT_ALIGN_CLASS_MAP[align]).toBe(`text-${align}`);
    });
  });

  it('should total align values', () => {
    expect(OAlign.length).toBe(6);
  });
});
