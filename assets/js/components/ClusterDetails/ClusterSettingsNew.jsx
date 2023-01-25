import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getCluster } from '@state/selectors';

import PageHeader from '@components/PageHeader';
import BackButton from '@components/BackButton';
import { getClusterName } from '@components/ClusterLink';
import { ClusterInfoBox } from '@components/ClusterDetails';
import WarningBanner from '@components/Banners/WarningBanner';
import ChecksSelectionNew from './ChecksSelectionNew';
import { UNKNOWN_PROVIDER } from './ClusterSettings';

export function ClusterSettingsNew() {
  const { clusterID } = useParams();

  const cluster = useSelector(getCluster(clusterID));

  if (!cluster) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full px-2 sm:px-0">
      <BackButton url={`/clusters_new/${clusterID}`}>
        Back to Cluster Details
      </BackButton>
      <PageHeader
        header="Checks Selection for "
        highlighted={getClusterName(cluster)}
      />
      <ClusterInfoBox haScenario={cluster.type} provider={cluster.provider} />
      {cluster.provider === UNKNOWN_PROVIDER && (
        <WarningBanner>
          The following catalog is valid for on-premise bare metal platforms.
          <br />
          If you are running your HANA cluster on a different platform, please
          use results with caution
        </WarningBanner>
      )}
      <ChecksSelectionNew clusterId={clusterID} cluster={cluster} />
    </div>
  );
}
