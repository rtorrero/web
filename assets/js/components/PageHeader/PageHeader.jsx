import React from 'react';
import classNames from 'classnames';

function PageHeader({ className, children }) {
  return (
    <h1 className={classNames('text-3xl pb-2 truncate w-3/4', className)}>
      {children}
    </h1>
  );
}

export default PageHeader;
