import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { EOS_SETTINGS, EOS_CLEAR_ALL, EOS_PLAY_CIRCLE } from 'eos-icons-react';

import { RUNNING_STATES } from '@state/lastExecutions';

import Button from '@components/Button';
import PageHeader from '@components/PageHeader';
import BackButton from '@components/BackButton';
import Table from '@components/Table';
import ListView from '@components/ListView';
import ProviderLabel from '@components/ProviderLabel';
import DottedPagination from '@components/DottedPagination';
import ClusterNodeLink from '@components/ClusterDetails/ClusterNodeLink';
import SapSystemLink from '@components/SapSystemLink';
import { renderEnsaVersion } from '@components/SapSystemDetails';
import Tooltip from '@components/Tooltip';

import CheckResultsOverview from '@components/CheckResultsOverview';

import SBDDetails from './SBDDetails';
import AttributesDetails from './AttributesDetails';
import StoppedResources from './StoppedResources';
import { enrichNodes } from './HanaClusterDetails';

const nodeDetailsConfig = {
  usePadding: false,
  columns: [
    {
      title: 'Hostname',
      key: '',
      render: (_, { id, name }) => (
        <ClusterNodeLink hostId={id}>{name}</ClusterNodeLink>
      ),
    },
    {
      title: 'Role',
      key: 'roles',
      render: (content) =>
        content?.map((role) => role.toUpperCase()).join(', '),
    },
    {
      title: 'Virtual IP',
      key: 'virtual_ips',
      className: 'table-col-m',
      render: (content) => content?.join(', '),
    },
    {
      title: 'Filesystem',
      key: 'filesystems',
      className: 'table-col-m',
      render: (content) => content?.join(', '),
    },
    {
      title: '',
      key: '',
      className: 'table-col-xs',
      render: (_, item) => {
        const { attributes, resources } = item;
        return (
          <AttributesDetails
            title="Node Details"
            attributes={attributes}
            resources={resources}
          />
        );
      },
    },
  ],
};

function AscsErsClusterDetails({
  clusterID,
  clusterName,
  selectedChecks,
  hasSelectedChecks,
  cibLastWritten,
  provider,
  hosts,
  sapSystems,
  details,
  catalog,
  lastExecution,
  onStartExecution,
  navigate,
}) {
  const [enrichedSapSystems, setEnrichedSapSystems] = useState([]);
  const [currentSapSystem, setCurrentSapSystem] = useState(null);

  useEffect(() => {
    const systems = details?.sap_systems.map((system) => ({
      ...system,
      ...sapSystems.find(({ sid }) => sid === system.sid),
      nodes: enrichNodes(system?.nodes, hosts),
    }));

    setEnrichedSapSystems(systems);
    setCurrentSapSystem(systems[0]);
  }, [hosts, sapSystems, details]);

  const catalogData = get(catalog, 'data');
  const catalogLoading = get(catalog, 'loading');
  const catalogError = get(catalog, 'error');

  const executionData = get(lastExecution, 'data');
  const executionLoading = get(lastExecution, 'loading', true);
  const executionError = get(lastExecution, 'error');

  const startExecutionDisabled =
    executionLoading ||
    !hasSelectedChecks ||
    RUNNING_STATES.includes(executionData?.status);

  return (
    <div>
      <BackButton url="/clusters">Back to Clusters</BackButton>
      <div className="flex flex-wrap">
        <div className="flex w-1/2 h-auto overflow-hidden overflow-ellipsis break-words">
          <PageHeader className="whitespace-normal">
            Pacemaker Cluster Details:{' '}
            <span className="font-bold">{clusterName}</span>
          </PageHeader>
        </div>
        <div className="flex w-1/2 justify-end">
          <div className="flex w-fit whitespace-nowrap">
            <Button
              type="primary-white"
              className="inline-block mx-0.5 border-green-500 border"
              size="small"
              onClick={() => navigate(`/clusters/${clusterID}/settings`)}
            >
              <EOS_SETTINGS className="inline-block fill-jungle-green-500" />{' '}
              Check Selection
            </Button>

            <Button
              type="primary-white"
              className="mx-0.5 border-green-500 border"
              size="small"
              onClick={() => navigate(`/clusters/${clusterID}/executions/last`)}
            >
              <EOS_CLEAR_ALL className="inline-block fill-jungle-green-500" />{' '}
              Show Results
            </Button>

            <Tooltip
              isEnabled={!hasSelectedChecks}
              content="Select some Checks first!"
              place="bottom"
            >
              <Button
                type="primary"
                className="mx-1"
                onClick={() => {
                  onStartExecution(clusterID, hosts, selectedChecks, navigate);
                }}
                disabled={startExecutionDisabled}
              >
                <EOS_PLAY_CIRCLE
                  className={`${
                    !startExecutionDisabled ? 'fill-white' : 'fill-gray-200'
                  } inline-block align-sub`}
                />{' '}
                Start Execution
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="flex xl:flex-row flex-col">
        <div className="mt-4 bg-white shadow rounded-lg py-8 px-8 xl:w-2/5 mr-4">
          <ListView
            className="grid-rows-2"
            titleClassName="text-lg"
            orientation="vertical"
            data={[
              {
                title: 'Provider',
                content: provider || 'Not defined',
                render: (content) => <ProviderLabel provider={content} />,
              },
              {
                title: 'Fencing type',
                content: details && details.fencing_type,
              },
              {
                title: 'Cluster type',
                content: 'ASCS/ERS',
              },

              {
                title: 'CIB last written',
                content: cibLastWritten || '-',
              },
            ]}
          />
        </div>
        <div className="flex flex-col mt-4 bg-white shadow rounded-lg pt-8 px-8 xl:w-2/5 mr-4">
          <ListView
            className="grid-rows-2"
            titleClassName="text-lg"
            orientation="vertical"
            data={[
              {
                title: 'SID',
                content: currentSapSystem,
                render: (content) => (
                  <SapSystemLink
                    sapSystemId={content?.id}
                    systemType="sap_systems"
                  >
                    {content?.sid}
                  </SapSystemLink>
                ),
              },
              {
                title: 'ASCS/ERS distributed',
                content: currentSapSystem?.distributed ? 'Yes' : 'No',
              },
              {
                title: 'ENSA version',
                content: currentSapSystem?.ensa_version || '-',
                render: (content) => renderEnsaVersion(content),
              },
              {
                title: 'Filesystem resource based',
                content: currentSapSystem?.filesystem_resource_based
                  ? 'Yes'
                  : 'No',
              },
            ]}
          />
          <div className="flex justify-center mt-auto pt-8 mb-2">
            <DottedPagination
              pages={enrichedSapSystems}
              onChange={setCurrentSapSystem}
            />
          </div>
        </div>
        <div className="mt-4 bg-white shadow rounded-lg py-4 xl:w-1/4">
          <CheckResultsOverview
            data={executionData}
            catalogDataEmpty={catalogData?.length === 0}
            loading={catalogLoading || executionLoading}
            error={catalogError || executionError}
            onCheckClick={(health) =>
              navigate(
                `/clusters/${clusterID}/executions/last?health=${health}`
              )
            }
          />
        </div>
      </div>

      {details && details.stopped_resources.length > 0 && (
        <StoppedResources resources={details.stopped_resources} />
      )}

      <div className="mt-2">
        <Table config={nodeDetailsConfig} data={currentSapSystem?.nodes} />
      </div>

      <SBDDetails sbdDevices={details.sbd_devices} />
    </div>
  );
}

export default AscsErsClusterDetails;
