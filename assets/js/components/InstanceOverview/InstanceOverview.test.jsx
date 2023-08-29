import React from 'react';
import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { databaseInstanceFactory } from '@lib/test-utils/factories';
import InstanceOverview from './InstanceOverview';
import { renderWithRouter, withState } from '@lib/test-utils';
import { DATABASE_TYPE, APPLICATION_TYPE } from '@lib/model';
import { faker } from '@faker-js/faker';
import '@testing-library/jest-dom';

describe('InstanceOverview', () => {
  const mockInstance = databaseInstanceFactory.build();
  const cleanInitialState = {
    hostsList: {
      hosts: [],
    },
    clustersList: {
      clusters: [],
    },
    databasesList: {
      databases: [],
      databaseInstances: [mockInstance],
    },
  };

  it('renders HealthIcon for a registered instance', () => {
    const [StatefulDatabaseList] = withState(
      <InstanceOverview
        instanceType={APPLICATION_TYPE}
        instance={mockInstance}
      />,
      cleanInitialState
    );

    renderWithRouter(StatefulDatabaseList);
    const healthIcon = screen.getByTestId('eos-svg-component');
    expect(healthIcon).toBeDefined();
  });

  it('renders tooltip content for absent instances', async () => {
    const user = userEvent.setup();

    const absentInstance = {
      ...mockInstance,
      absent_at: faker.date.past().toISOString(),
    };
    const state = {
      ...cleanInitialState,
      databasesList: {
        databases: [],
        databaseInstances: [absentInstance],
      },
    };

    const [StatefulDatabaseList] = withState(
      <InstanceOverview
        instanceType={APPLICATION_TYPE}
        instance={absentInstance}
      />,
      state
    );

    renderWithRouter(StatefulDatabaseList);
    await act(async () => user.hover(screen.getByTestId('absent-tooltip')));
    await waitFor(() =>
      expect(
        screen.queryByText('Instance currently not registered.')
      ).toBeVisible()
    );
  });

  //   it('renders system replication data for database type', () => {
  //     const modifiedInstance = { ...mockInstance, absent_at: true };
  //     renderWithRouter(
  //       <InstanceOverview
  //         instanceType={DATABASE_TYPE}
  //         instance={modifiedInstance}
  //       />
  //     );
  //     const replicationText = screen.getByText('HANA replicationValue');
  //     expect(replicationText).toBeInTheDocument();
  //   });
});
