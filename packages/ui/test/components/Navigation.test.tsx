import React from 'react';

import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react';

import { Navigation } from '../../src';


jest.mock('../../src/components/navbar', () => ({
  Navbar: ({
    title,
    subtitle,
    onToggleSidebar,
    isSidebarCollapsed,
  }: {
    title?: string;
    subtitle?: string;
    onToggleSidebar: () => void;
    isSidebarCollapsed: boolean;
  }) => (
    <>
      {title && (
        <p>{title}</p>
      )}
      {subtitle && (
        <p>{subtitle}</p>
      )}
      <button
        type="button"
        aria-label="toggle-navbar"
        data-collapsed={isSidebarCollapsed}
        onClick={onToggleSidebar}
      >
        Navbar
      </button>
    </>
  ),
}));


jest.mock('../../src/components/sidebar', () => ({
  Sidebar: ({
    isCollapsed,
  }: {
    isCollapsed: boolean;
  }) => (
    <aside
      data-testid="sidebar"
      data-collapsed={isCollapsed}
    >
      Sidebar
    </aside>
  ),
}));


const defaultProps = {
  menu: [
    {
      href: '/home',
      label: 'Home',
      icon: 'home',
    },
  ],

  logout: {
    label: 'Logout',
    onClick: jest.fn(),
  },

  variant: 'dark' as const,

  pathname: '/home',

  onItemClick: jest.fn(),

  isAuthenticated: true,

  children: (
    <div>
      Content
    </div>
  ),
};


const renderNavigation = (
  props = {},
) => {
  return render(
    <Navigation
      {...defaultProps}
      {...props}
    />,
  );
};



describe('Navigation', () => {


  it('should render children content', () => {

    renderNavigation({ withLanguageSwitch: true });


    expect(
      screen.getByText('Content'),
    )
    .toBeInTheDocument();

  });



  it('should render navbar when authenticated', () => {

    renderNavigation();


    expect(
      screen.getByRole('button', {
        name: 'toggle-navbar',
      }),
    )
    .toBeInTheDocument();

  });



  it('should render sidebar when authenticated', () => {

    renderNavigation();


    expect(
      screen.getByTestId('sidebar'),
    )
    .toBeInTheDocument();

  });



  it('should not render sidebar when not authenticated', () => {

    renderNavigation({
      isAuthenticated: false,
    });


    expect(
      screen.queryByTestId('sidebar'),
    )
    .not
    .toBeInTheDocument();

  });



  it('should toggle sidebar collapsed state', () => {

    renderNavigation();


    const navbarButton =
      screen.getByRole('button', {
        name: 'toggle-navbar',
      });


    const sidebar =
      screen.getByTestId('sidebar');


    expect(sidebar)
    .toHaveAttribute(
      'data-collapsed',
      'false',
    );


    fireEvent.click(navbarButton);


    expect(sidebar)
    .toHaveAttribute(
      'data-collapsed',
      'true',
    );


    fireEvent.click(navbarButton);


    expect(sidebar)
    .toHaveAttribute(
      'data-collapsed',
      'false',
    );

  });



  it('should render sidebar overlay when sidebar is visible', () => {

    renderNavigation();


    expect(
      screen.getByRole('button', {
        name: 'Navigation Close Sidebar',
      }),
    )
    .toBeInTheDocument();

  });



  it('should hide sidebar overlay when sidebar is collapsed', () => {

    renderNavigation();


    fireEvent.click(
      screen.getByRole('button', {
        name: 'toggle-navbar',
      }),
    );


    expect(
      screen.queryByRole('button', {
        name: 'Navigation Close Sidebar',
      }),
    )
    .not
    .toBeInTheDocument();

  });



  it('should apply primary theme by default', () => {

    renderNavigation();


    expect(
      screen.getByRole('button', {
        name: 'toggle-navbar',
      }),
    )
    .toBeInTheDocument();

  });

  it('should render navbar with title', () => {
    const title = 'Navbar Title';
    renderNavigation({ title });

    expect(
      screen.getByText(title),
    )
    .toBeInTheDocument();
  });

  it('should render navbar with title and withLanguageSwitch', () => {
    const title = 'navigation.title';
    renderNavigation({ title, withLanguageSwitch: true });

    expect(
      screen.getByText(title),
    )
    .toBeInTheDocument();
  });

  it('should render navbar with subtitle', () => {
    const subtitle = 'Navbar Subtitle';
    renderNavigation({ subtitle });

    expect(
      screen.getByText(subtitle),
    )
    .toBeInTheDocument();
  });

  it('should render navbar with subtitle withLanguageSwitch', () => {
    const subtitle = 'navigation.subtitle';
    renderNavigation({ subtitle, withLanguageSwitch: true });

    expect(
      screen.getByText(subtitle),
    )
    .toBeInTheDocument();
  });


});