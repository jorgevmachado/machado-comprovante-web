import { render, screen } from '@testing-library/react';

import { Icon } from '../../src';

describe('<Icon />', () => {
  it('render icon string react', () => {
    render(<Icon icon="react" className="bg-red" aria-label="react icon"/>)
    expect(screen.getByTestId('icon-fa-react'))
  });

  it('render icon component react', () => {
    const icon = (
      <svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
        <path
          fillRule='evenodd'
          d='M18 10A8 8 0 114 3.08V2a1 1 0 112 0v2.126A8 8 0 0118 10zm-8-3a1 1 0 100 2 1 1 0 000-2zm1 4a1 1 0 10-2 0v3a1 1 0 102 0v-3z'
          clipRule='evenodd'
        />
      </svg>
    )
    render(<Icon icon={icon}/>)
    expect(screen.getByTestId('icon-custom'))
  });
});