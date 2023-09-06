import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getEnrichedSapSystemDetails } from '@state/selectors/sapSystem';

import BackButton from '@components/BackButton';
import DeregistrationModal from '@components/DeregistrationModal';
import { GenericSystemDetails } from '@components/SapSystemDetails';
import { APPLICATION_TYPE } from '@lib/model';

function SapSystemDetails({ onInstanceCleanUp }) {
  const { id } = useParams();
  const sapSystem = useSelector((state) =>
    getEnrichedSapSystemDetails(state, id)
  );
  const [cleanUpModalOpen, setCleanUpModalOpen] = useState(false);
  const [instanceToDeregister, setInstanceToDeregister] = useState(undefined);

  if (!sapSystem) {
    return <div>Not Found</div>;
  }

  return (
    <>
      <BackButton url="/sap_systems">Back to SAP Systems</BackButton>

      <DeregistrationModal
        contentType={DATABASE_TYPE}
        instanceNumber={instanceToDeregister?.instance_number}
        sid={instanceToDeregister?.sid}
        isOpen={!!cleanUpModalOpen}
        onCleanUp={() => {
          setCleanUpModalOpen(false);
          onInstanceCleanUp(instanceToDeregister);
        }}
        onCancel={() => {
          setCleanUpModalOpen(false);
        }}
      />
      <GenericSystemDetails
        title="SAP System Details"
        type={APPLICATION_TYPE}
        system={sapSystem}
        onCleanUpClick={(instance, _type) => {
          setCleanUpModalOpen(true);
          setInstanceToDeregister(instance);
        }}
      />
    </>
  );
}

export default SapSystemDetails;
