import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import StatusPill from './StatusPill';

describe('StatusPill', () => {
  it('should render passing status correctly', () => {
    render(<StatusPill heartbeat="passing">Test Service</StatusPill>);

    expect(
      screen.getByText('/Test Service/', { exact: false })
    ).toHaveTextContent('running');
  });

  it('should render critical status correctly', () => {
    render(<StatusPill heartbeat="critical">Test Service</StatusPill>);

    expect(
      screen.getByText('/Test Service/', { exact: false })
    ).toHaveTextContent('not running');
  });

  it('should render unknown status correctly', () => {
    render(<StatusPill heartbeat="unknown">Test Service</StatusPill>);

    expect(
      screen.getByText('/Test Service/', { exact: false })
    ).toHaveTextContent('unknown');
  });
});
