import React from 'react';
import { uniq } from '@lib/lists';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import Filter from './Filter';
import { useEffect } from 'react';

const getDefaultFilterFunction = (filter, key) => (element) => {
  return filter.includes(element[key]);
};

const setFilter = (filters, filterKey, filterValue, filterFunction) => {
  const { found, filtersList } = filters.reduce(
    ({ found, filtersList }, current) => {
      const { key } = current;
      return filterKey === key
        ? {
            found: true,
            filtersList: [
              ...filtersList,
              { key, value: filterValue, filterFunction },
            ],
          }
        : { found, filtersList: [...filtersList, current] };
    },
    { found: false, filtersList: [] }
  );

  return found
    ? filtersList
    : [...filtersList, { key: filterKey, value: filterValue, filterFunction }];
};

export const TableFilters = ({ config, data, filters, onChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filterFunction = (list, column) =>
    typeof column.filter === 'function'
      ? column.filter(list, column.key)
      : getDefaultFilterFunction(list, column.key);

  return config.columns
    .filter(({ filter }) => Boolean(filter))
    .map((column) => {
      const [filterValue, setFilterValue] = useState([]);

      const filterOptions = uniq(
        data
          .map(({ [column.key]: option }) => option)
          .flat(Infinity)
          .concat(filterValue)
      );

      useEffect(() => {
        setFilterValue(searchParams.getAll(column.key));
      }, [searchParams]);

      useEffect(() => {
        onChange(
          setFilter(
            filters,
            column.key,
            searchParams.getAll(column.key),
            filterFunction(filterValue, column)
          )
        );
      }, [JSON.stringify(filterValue)]);

      const applyFilters = (list) => {
        let newSearchParams = searchParams;
        newSearchParams.delete(column.key);
        list.forEach((elem) => {
          newSearchParams.append(column.key, elem);
        });
        setSearchParams(newSearchParams);
        setFilterValue(list);

        onChange(
          setFilter(filters, column.key, list, filterFunction(list, column))
        );
      };

      return (
        <Filter
          key={column.key}
          title={column.title}
          options={filterOptions}
          value={filterValue}
          onChange={(filterValue) => applyFilters(filterValue)}
        />
      );
    });
};
