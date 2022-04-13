import React from 'react';

import { Link } from 'react-router-dom';

const SapSystemLink = ({ sapSystems: sapSystems }) => {
  const linkList = Object.entries(sapSystems).map(([systemType, instances]) => {
    return instances.map((instance) => (
      <Link
        key={instance.sap_system_id}
        className="text-jungle-green-500 hover:opacity-75"
        to={`/${systemType}/${instance.sap_system_id}`}
      >
        {instance.sid}
      </Link>
    ));
  });

  //return linkList.reduce((prev, curr) => [prev, ',', curr]);

  return linkList.map((link) => link).reduce((prev, curr) => [prev, ',', curr]);
};

export default SapSystemLink;
