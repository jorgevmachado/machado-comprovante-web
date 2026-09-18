type EntityValueType = 'string' | 'number';


type ValidateValueParams = {
  type?: EntityValueType;
  value?: string | number;
  defaultValue?: number | string;
}
export function validateValue({ type = 'string', value, defaultValue }: ValidateValueParams ): number | string {
  const functionDefaultValue = 'unknown';
  if (type === 'string') {
    const currentDefaultValue = typeof defaultValue === 'string' ? defaultValue : functionDefaultValue;
    if (!value || typeof value !== 'string') {
      return currentDefaultValue;
    }
    return value;
  }

  if (type === 'number') {
    const currentDefaultValue = typeof defaultValue === 'number' ? defaultValue : 0;
    if (!value || typeof value !== 'number') {
      return currentDefaultValue;
    }
    return value;
  }

  return functionDefaultValue;

}

type GetObjectValueParams ={
   key: string;
   type?: EntityValueType;
   obj: unknown | Record<string, unknown>;
  defaultValue?: number | string;
}

export function objectHasKey<K extends string>(obj: unknown, key: K): obj is Record<K, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj;
}

export function getObjectValue({ type = 'string', obj, key, defaultValue = ''}: GetObjectValueParams): string {
  if(!objectHasKey(obj, key)) {
    return '';
  }
  const value = obj[key] as string | undefined;
  const valueValidated = validateValue({ value, type, defaultValue })
  return String(valueValidated);
}