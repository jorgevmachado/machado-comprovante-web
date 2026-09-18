import React from 'react';

import { render ,screen } from '@testing-library/react';

import { buildTableCellTheme } from '@machado-repo/theme';

import { Lang } from '../../../../src/lang';
import { TableCell } from '../../../../src/components/table/cell';

jest.mock('@machado-repo/theme', () => ({ buildTableCellTheme: jest.fn(), }));

jest.mock('../../../../src/lang', () => ({
  Lang: jest.fn(({ children }) => (
    <span data-testid="lang"> {children} </span>
  ))
}));

const mockBuildTableCellTheme = buildTableCellTheme as jest.Mock;
const mockLang = Lang as jest.Mock;

describe('TableCell' ,() => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBuildTableCellTheme.mockReturnValue(
      { cell: 'cell-class' ,content: 'content-class'  });
  });
  describe('when type is body' ,() => {
    it('should render a td element' ,() => {
      render(<TableCell type="body"
                        className="custom-class"> Content </TableCell> );
      expect(screen.getByText('Content').closest('td')).toBeInTheDocument();
    });
  });
  describe('when type is footer' ,() => {
    it('should render a td element' ,() => {
      render(<TableCell type="footer"
                        className="custom-class"> Content </TableCell> );
      expect(screen.getByText('Content').closest('td')).toBeInTheDocument();
    });
  });
  describe('when type is header' ,() => {
    it('should render a th element' ,() => {
      render(<TableCell type="header"
                        className="custom-class"> Content </TableCell> );
      expect(screen.getByText('Content').closest('th')).toBeInTheDocument();
    });
  });
  it('should apply the cell class returned by buildTableCellTheme' ,() => {
    render(<TableCell type="body"
                      className="custom-class"> Content </TableCell> );
    const cell = screen.getByText('Content').closest('td');
    expect(cell).toHaveClass('cell-class');
  });
  it('should apply the content class returned by buildTableCellTheme' ,() => {
    render(<TableCell type="body"
                      className="custom-class"> Content </TableCell> );
    const content = screen.getByTestId('lang').parentElement;
    expect(content).toHaveClass('content-class');
  });
  it('should call buildTableCellTheme with type, className and align' ,() => {
    render(<TableCell type="body" className="custom-class"
                      align="right"> Content </TableCell> );
    expect(mockBuildTableCellTheme).toHaveBeenCalledTimes(1);
    expect(mockBuildTableCellTheme).
    toHaveBeenCalledWith('body' ,'custom-class' ,'right' );
  });
  it('should pass depth 3 to Lang' ,() => {
    render(<TableCell type="body" className="custom-class">Content</TableCell>);
    expect(mockLang).toHaveBeenCalledTimes(1);
    expect(mockLang).toHaveBeenCalledWith(
      expect.objectContaining({
        depth: 3,
        children: 'Content',
      }),
      undefined,
    );
  });
  it('should render children inside Lang' ,() => {
    render(<TableCell type="body" className="custom-class"> Content </TableCell>);
    expect(screen.getByTestId('lang')).toHaveTextContent('Content');
  });
  it('should not render Lang when children are not provided' ,() => {
    render(<TableCell type="body" className="custom-class"/> );
    expect(mockLang).not.toHaveBeenCalled();
    expect(screen.queryByTestId('lang')).not.toBeInTheDocument();
  });
  it('should not render Lang when children are null' ,() => {
    render(<TableCell type="body" className="custom-class">{null}</TableCell>);
    expect(mockLang).not.toHaveBeenCalled();
    expect(screen.queryByTestId('lang')).not.toBeInTheDocument();
  });
  it('should render multiple children' ,() => {
    render(<TableCell type="body" className="custom-class"> <span>First</span>
      <span>Second</span> </TableCell> );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
  it('should render the content wrapper only when children exist' ,() => {
    const { rerender } = render(<TableCell type="body" className="custom-class">Content</TableCell> );
    expect(screen.getByTestId('lang').parentElement).toBeInTheDocument();
    rerender(<TableCell type="body" className="custom-class"/> );
    expect(screen.queryByTestId('lang')).not.toBeInTheDocument();
  });
});