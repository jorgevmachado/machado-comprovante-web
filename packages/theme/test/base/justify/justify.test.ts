import { type TJustify ,JUSTIFY_CLASS_MAP, OJustify  } from '../../../src';

describe('justify', () => {
  it('should map justify values to class names', () => {
    (Object.keys(JUSTIFY_CLASS_MAP) as TJustify[]).forEach((justify) => {
      expect(JUSTIFY_CLASS_MAP[justify]).toBe(`justify-${justify}`);
    });
  });

  it('should total justify values', () => {
    expect(OJustify.length).toBe(6);
  });
});
