import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { Navbar } from  '../../src';

jest.mock('@machado-repo/i18n', () => ({
  useAppTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../src/primitives', () => ({
  Icon: ({ icon }: { icon: string }) => (
    <span data-testid="icon">
      {icon}
    </span>
  ),

  LanguageSwitcher: ({ variant }: { variant: string }) => (
    <div data-testid="language-switcher">
      {variant}
    </div>
  ),
}));


describe('Navbar', () => {

  const defaultProps = {
    variant: 'dark' as const,
    title: 'Dashboard',
    subtitle: 'Financial system',
    isAuthenticated: true,
    isSidebarCollapsed: false,
    onToggleSidebar: jest.fn(),
  };


  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('should render title and subtitle', () => {
    render(
      <Navbar {...defaultProps} />
    );


    expect(
      screen.getByText('Dashboard')
    ).toBeInTheDocument();


    expect(
      screen.getByText('Financial system')
    ).toBeInTheDocument();
  });



  it('should render sidebar button when authenticated', () => {

    render(
      <Navbar {...defaultProps} />
    );


    expect(
      screen.getByRole('button')
    ).toBeInTheDocument();

  });



  it('should not render sidebar button when unauthenticated', () => {

    render(
      <Navbar
        {...defaultProps}
        isAuthenticated={false}
      />
    );


    expect(
      screen.queryByRole('button')
    ).not.toBeInTheDocument();

  });



  it('should call onToggleSidebar when sidebar button is clicked', () => {

    const onToggleSidebar = jest.fn();

    render(
      <Navbar
        {...defaultProps}
        onToggleSidebar={onToggleSidebar}
      />
    );


    fireEvent.click(
      screen.getByRole('button')
    );


    expect(
      onToggleSidebar
    ).toHaveBeenCalledTimes(1);

  });



  it('should render menu icon when sidebar is collapsed', () => {

    render(
      <Navbar
        {...defaultProps}
        isSidebarCollapsed={true}
      />
    );


    expect(
      screen.getByTestId('icon')
    ).toHaveTextContent('menu');

  });



  it('should render menu-open icon when sidebar is expanded', () => {

    render(
      <Navbar
        {...defaultProps}
        isSidebarCollapsed={false}
      />
    );


    expect(
      screen.getByTestId('icon')
    ).toHaveTextContent('menu-open');

  });



  it('should render custom icon', () => {

    render(
      <Navbar
        {...defaultProps}
        icon="attach-money"
      />
    );


    expect(
      screen.getAllByTestId('icon').length
    ).toBeGreaterThan(0);

  });



  it('should render LanguageSwitcher when enabled', () => {

    render(
      <Navbar
        {...defaultProps}
        withLanguageSwitch
      />
    );


    expect(
      screen.getByTestId('language-switcher')
    ).toBeInTheDocument();


  });



  it('should not render LanguageSwitcher by default', () => {

    render(
      <Navbar {...defaultProps}/>
    );


    expect(
      screen.queryByTestId('language-switcher')
    ).not.toBeInTheDocument();

  });



  it('should apply secondary dark theme classes', () => {

    const { container } = render(
      <Navbar
        {...defaultProps}
        tone="secondary"
        variant="dark"
      />
    );


    expect(
      container.firstChild
    ).toHaveClass(
      'from-[#2e1065]'
    );

  });



  it('should apply neutral light theme classes', () => {
    const { container } = render(
      <Navbar
        {...defaultProps}
        tone="neutral"
        variant="light"
      />
    );

    expect(
      container.firstChild
    ).toHaveClass(
      'from-[#ffffff]'
    );

    expect(
      container.firstChild
    ).toHaveClass(
      'via-[#f8fafc]'
    );

    expect(
      container.firstChild
    ).toHaveClass(
      'to-[#e2e8f0]'
    );
  });

});