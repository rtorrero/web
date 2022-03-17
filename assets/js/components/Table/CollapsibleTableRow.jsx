import React, { Fragment, useState } from 'react';

const CollapsibleTableRow = ({
  columns,
  item,
  collapsibleDetailRenderer,
  renderCells = () => {},
  colspan = 1,
}) => {
  const [rowExpanded, toggleRow] = useState(false);
  return (
    <Fragment>
      <tr
        className={collapsibleDetailRenderer ? 'cursor-pointer' : ''}
        onClick={() => {
          if (collapsibleDetailRenderer) {
            toggleRow(!rowExpanded);
          }
        }}
      >
        {renderCells(columns, item)}
      </tr>
      {collapsibleDetailRenderer && (
        <tr
          className={`overflow-y-hidden ${
            rowExpanded ? 'visible' : 'hidden'
          } transition-all ease-in-out duration-600`}
        >
          <td colspan={colspan}>{collapsibleDetailRenderer(item)}</td>
        </tr>
      )}
    </Fragment>
  );
};

export default CollapsibleTableRow;
