import React from 'react';

function PageHeader({ header, highlighted }) {
  return (
    <h1
      className="text-3xl pb-2"
      style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '700px',
        width: '700px',
        display: 'inline-block',
      }}
    >
      {header}
      <span className="font-bold">{highlighted}</span>
    </h1>
  );
}

export default PageHeader;
