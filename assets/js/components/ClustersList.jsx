import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Table from './Table';
import Tags from './Tags';
import { addTagToCluster, removeTagFromCluster } from '@state/clusters';
import ClusterLink from '@components/ClusterLink';
import { useState } from 'react';
import { useEffect } from 'react';
import { ExecutionIcon } from '@components/ClusterDetails';
//import { ComponentHealthSummary } from '@components/HealthSummary';
import HealthSummary from '@components/HealthSummary';
import { post, del } from '@lib/network';
import useQueryStringValues from '@hooks/useQueryStringValues';

const getClusterTypeLabel = (type) => {
  switch (type) {
    case 'hana_scale_up':
      return 'HANA Scale Up';
    case 'hana_scale_out':
      return 'HANA Scale Out';
    default:
      return 'Unknown';
  }
};

const addTag = (tag, clusterId) => {
  post(`/api/clusters/${clusterId}/tags`, {
    value: tag,
  });
};

const removeTag = (tag, clusterId) => {
  del(`/api/clusters/${clusterId}/tags/${tag}`);
};

const ClustersList = () => {
  const clusters = useSelector((state) => state.clustersList.clusters);
  const dispatch = useDispatch();

  const config = {
    pagination: true,
    usePadding: false,
    columns: [
      {
        title: 'Health',
        key: 'health',
        filter: true,
        render: (health, { checks_execution: checksExecution }) => {
          return (
            <div className="ml-4">
              <ExecutionIcon health={health} executionState={checksExecution} />
            </div>
          );
        },
      },
      {
        title: 'Name',
        key: 'name',
        filter: true,
        render: (content, item) => (
          <span className="tn-clustername">
            <ClusterLink cluster={item} />
          </span>
        ),
      },
      {
        title: 'SID',
        key: 'sid',
        filter: true,
      },
      {
        title: 'Hosts',
        key: 'hosts_number',
      },
      {
        title: 'Resources',
        key: 'resources_number',
      },
      {
        title: 'Type',
        key: 'type',
        filter: true,
        render: (content, item) => (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 truncate">
            {getClusterTypeLabel(item.type)}
          </span>
        ),
      },
      {
        title: 'Tags',
        key: 'tags',
        className: 'w-80',
        filter: (filter, key) => (element) =>
          element[key].some((tag) => filter.includes(tag)),
        render: (content, item) => (
          <Tags
            tags={content}
            onChange={() => {}}
            onAdd={(tag) => {
              addTag(tag, item.id);
              dispatch(
                addTagToCluster({ tags: [{ value: tag }], id: item.id })
              );
            }}
            onRemove={(tag) => {
              removeTag(tag, item.id);
              dispatch(
                removeTagFromCluster({ tags: [{ value: tag }], id: item.id })
              );
            }}
          />
        ),
      },
    ],
  };

  const data = clusters.map((cluster) => {
    return {
      health: cluster.health,
      name: cluster.name,
      id: cluster.id,
      sid: cluster.sid,
      type: cluster.type,
      hosts_number: cluster.hosts_number,
      resources_number: cluster.resources_number,
      checks_execution: cluster.checks_execution,
      selected_checks: cluster.selected_checks,
      tags: (cluster.tags && cluster.tags.map((tag) => tag.value)) || [],
    };
  });

  const isMostRelevantPrio = (predicate, label) => {
    switch (label) {
      case 'critical':
        return any(predicate, label);

      case 'warning':
        return !any(predicate, 'critical') && any(predicate, label);

      case 'passing':
        return (
          !any(predicate, 'critical') &&
          !any(predicate, 'warning') &&
          any(predicate, label)
        );
    }
  };

  const any = (predicate, label) =>
    Object.keys(predicate).reduce((accumulator, key) => {
      if (accumulator) {
        return true;
      }
      return predicate[key] === label;
    }, false);

  const getCounters = (data) => {
    const defaultCounter = { critical: 0, warning: 0, passing: 0, unknown: 0 };

    if (!data || 0 === data.length) {
      return defaultCounter;
    }

    return data.reduce((accumulator, element) => {
      if (isMostRelevantPrio(element, 'critical')) {
        return { ...accumulator, critical: accumulator.critical + 1 };
      }

      if (isMostRelevantPrio(element, 'warning')) {
        return { ...accumulator, warning: accumulator.warning + 1 };
      }

      if (isMostRelevantPrio(element, 'unknown')) {
        return { ...accumulator, unknown: accumulator.unknown + 1 };
      }

      if (isMostRelevantPrio(element, 'passing')) {
        return { ...accumulator, passing: accumulator.passing + 1 };
      }
      return accumulator;
    }, defaultCounter);
  };

  const { loading, sapSystemsHealth } = useSelector(
    (state) => state.sapSystemsHealthSummary
  );

  const {
    extractedParams: { health: healthFilters = [] },
    setQueryValues,
  } = useQueryStringValues(['health']);

  const [counters, setCounters] = useState({
    warning: 0,
    critical: 0,
    passing: 0,
  });

  const [summaryData, setSummaryData] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    setCounters(getCounters(sapSystemsHealth));
    setSummaryData(sapSystemsHealth);
  }, [sapSystemsHealth]);

  useEffect(() => {
    setActiveFilters(
      healthFilters.reduce((acc, curr) => ({ ...acc, [curr]: true }), {})
    );
    if (healthFilters.length === 0) {
      setSummaryData(sapSystemsHealth);
      return;
    }
    setSummaryData(
      sapSystemsHealth.filter((e) => {
        let result = false;

        healthFilters.forEach((f) => {
          result = result || isMostRelevantPrio(e, f);
        });
        return result;
      })
    );
  }, [healthFilters]);

  const onFiltersChange = (filterValue) => {
    const newFilters = healthFilters.includes(filterValue)
      ? healthFilters.filter((f) => f !== filterValue)
      : [...healthFilters, filterValue];

    setQueryValues({ health: newFilters });
  };

  return (
    <Fragment>
      <HealthSummary
        {...counters}
        onFilterChange={onFiltersChange}
        activeFilters={activeFilters}
      />
      <Table config={config} data={data} />
    </Fragment>
  );
};

export default ClustersList;
