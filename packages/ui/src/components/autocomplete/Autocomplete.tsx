import React ,{ useCallback ,useLayoutEffect ,useMemo ,useState } from 'react';

import Input from '../input';

import type { AutocompleteProps, AutocompleteOption } from './types';

const resolveDisplayValue = (optionValue: string, options: ReadonlyArray<AutocompleteOption>): string => {
  const selectedOption = options.find((option) => option.value === optionValue);

  return selectedOption?.label ?? optionValue;
};

export default function Autocomplete({
    name,
    value,
    label,
    onBlur,
    options,
    onFocus,
    isLoading = false,
    maxOptions = 8,
    placeholder,
    filterOptions,
    onValueChange,
    noResultsText = 'No options found.',
    onSelectOption,
    onInputKeyDown,
    optionClassName,
    listboxClassName,
    loadingPlaceholder,
  ...autocompleteProps
}: AutocompleteProps) {
  const [inputValue, setInputValue] = useState<string>(value);
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  useLayoutEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      setInputValue(resolveDisplayValue(value, options));
    }, 0);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [options, value]);

  const getPredicate = useCallback((normalizedQuery: string) => {
    if(!filterOptions) {
      return (option: AutocompleteOption) => {
        const searchValue = `${option.label ?? option.value} ${option.description ?? ''}`.toLowerCase();

        return searchValue.includes(normalizedQuery);
      }
    }
    return (option: AutocompleteOption) => filterOptions(option, normalizedQuery);
  }, [filterOptions]);

  const normalizedQuery = useMemo(() => {
    return inputValue.trim().toLowerCase();
  }, [inputValue]);

  const filteredOptions = useMemo(() => {
    if (!normalizedQuery) {
      return options.slice(0, maxOptions);
    }

    const predicate = getPredicate(normalizedQuery);


    return options.filter(predicate).slice(0, maxOptions);
  }, [maxOptions, normalizedQuery, options, getPredicate]);

  const activeOptionId = highlightedIndex >= 0
    ? `${name}-option-${highlightedIndex}`
    : undefined;

  const resolvedPlaceholder = useMemo(() => {
    if (!isLoading) {
      return placeholder;
    }

    return loadingPlaceholder ?? `Loading ${name}...`;
  }, [isLoading, loadingPlaceholder, name, placeholder]);

  const selectOption = (option: AutocompleteOption): void => {
    setInputValue(option.label ?? option.value);
    onValueChange?.(option.value);
    onSelectOption?.(option);
    setIsOptionsOpen(false);
    setHighlightedIndex(-1);
  };

  return (
    <>
      <Input
        {...autocompleteProps}
        type="text"
        role="combobox"
        name={name}
        label={label}
        value={inputValue}
        isLoading={isLoading}
        placeholder={resolvedPlaceholder}
        aria-controls={`${name}-autocomplete-listbox`}
        aria-expanded={isOptionsOpen}
        aria-autocomplete="list"
        aria-activedescendant={activeOptionId}
        showClearButton
        onClear={() => {
          setInputValue('');
          onValueChange?.('');
          setIsOptionsOpen(false);
          setHighlightedIndex(-1);
        }}
        onFocus={(event) => {
          setIsOptionsOpen(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          globalThis.setTimeout(() => {
            setIsOptionsOpen(false);
            setHighlightedIndex(-1);
          }, 120);

          onBlur?.(event);
        }}
        onKeyDown={(event) => {
          onInputKeyDown?.(event);

          if (event.defaultPrevented) {
            return;
          }

          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setIsOptionsOpen(true);
            setHighlightedIndex((previousIndex) => {
              if (filteredOptions.length === 0) {
                return -1;
              }

              return previousIndex < filteredOptions.length - 1 ? previousIndex + 1 : 0;
            });
            return;
          }

          if (event.key === 'ArrowUp') {
            event.preventDefault();
            setIsOptionsOpen(true);
            setHighlightedIndex((previousIndex) => {
              if (filteredOptions.length === 0) {
                return -1;
              }

              return previousIndex > 0 ? previousIndex - 1 : filteredOptions.length - 1;
            });
            return;
          }

          if (event.key === 'Enter' && isOptionsOpen && highlightedIndex >= 0) {
            event.preventDefault();

            const selectedOption = filteredOptions[highlightedIndex];

            if (selectedOption) {
              selectOption(selectedOption);
            }

            return;
          }

          if (event.key === 'Escape') {
            setIsOptionsOpen(false);
            setHighlightedIndex(-1);
          }
        }}
        onValueChange={(nextValue) => {
          setInputValue(nextValue);
          onValueChange?.(nextValue);
          setIsOptionsOpen(true);
        }}
      />

      {isOptionsOpen ? (
        <ul
          id={`${name}-autocomplete-listbox`}
          role='listbox'
          className={
            `absolute left-0 right-0 top-[calc(100%+4px)] z-20 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg ${listboxClassName}`
          }
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => {
              const isHighlighted = highlightedIndex === index;

              return (
                <li
                  key={option.key}
                  id={`${name}-option-${index}`}
                  role='option'
                  aria-selected={isHighlighted}
                  onMouseDown={() => selectOption(option)}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition ${isHighlighted ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'} ${optionClassName}`}
                >
                  {option.label ?? option.value}
                </li>
              );
            })
          ) : (
            <li className='px-3 py-2 text-sm text-slate-400'>
              {noResultsText}
            </li>
          )}
        </ul>
      ) : null}
    </>
  );
};