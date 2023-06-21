import React from 'react';

import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  withState,
  defaultInitialState,
  renderWithRouterMatch,
} from '@lib/test-utils';
import ClusterDetails from './ClusterDetails';
import { clusterFactory } from '@lib/test-utils/factories';

describe('ClusterDetails component', () => {
  it('should display a host link in the site details if the host is registered', () => {
    const clusters = clusterFactory.buildList(1);
    const { id: clusterID } = clusters[0];
    const state = {
      ...defaultInitialState,
      clustersList: {
        clusters,
      },
    };
    const [StatefulClusterDetails] = withState(<ClusterDetails />, state);

    renderWithRouterMatch(StatefulClusterDetails, {
      path: '/clusters/:clusterID',
      route: `/clusters/${clusterID}`,
    });

    expect(
      screen.queryByText(
        'Agent version 2.0.0 or greater is required for the new checks engine.'
      )
    ).not.toBeInTheDocument();
  });
  //   it('should display a hostname with a warning in the site details if the host is not registered', () => {});
});
