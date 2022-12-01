export const description = (catalog, checkId) => {
  return catalog.find(({ id }) => id === checkId)?.description;
};

export const sortChecks = (checksResults = []) => {
  return checksResults.sort((a, b) => {
    return a.check_id > b.check_id ? 1 : -1;
  });
};

export const sortHosts = (hosts = []) => {
  return hosts.sort((a, b) => {
    return a.host_id > b.host_id ? 1 : -1;
  });
};

export const getHostname =
  (hosts = []) =>
  (hostId) => {
    return hosts.reduce((acc, host) => {
      if (host.id === hostId) {
        return host.hostname;
      }

      return acc;
    }, '');
  };

export const findCheck = (catalog, checkID) => {
  return catalog?.find((check) => check.id === checkID);
};

export const getCheckResults = (executionData) => {
  if (!executionData) {
    return [];
  }
  if (!executionData.check_results) {
    return [];
  }
  return executionData.check_results;
};

export const getHosts = (checkResults) => {
  return checkResults.flatMap(({ agents_check_results }) =>
    agents_check_results.map(({ agent_id }) => agent_id)
  );
};

export const getChecks = (checkResults) => {
  return checkResults.map(({ check_id }) => check_id);
};

export const getHealth = (checkResults, checkID, agentID) => {
  console.log('checkResults,', checkResults);
  console.log('checkID,', checkID);
  console.log('agentID,', JSON.stringify(agentID));
  const checkResult = checkResults.find(({ check_id }) => check_id === checkID);
  if (!checkResult) {
    return;
  }
  console.log('Check result is: ', JSON.stringify(checkResult));
  const agentCheckResult = checkResult.agents_check_results.find(
    ({ agent_id }) => agent_id === agentID
  );

  console.log('agentCheckResult is: ', JSON.stringify(agentCheckResult));
  // const failedExpectationEvaluations = agentCheckResult?.expectation_evaluations
  //   .filter((expectationEvaluation) => 'message' in expectationEvaluation)
  //   .filter(({ type }) => type !== 'expect');

  return {
    // expectations: checkResult.expectation_results.length,
    expectations: [],
    //failedExpectations: failedExpectationEvaluations.length,
    //health: failedExpectationEvaluations.length > 0 ? 'critical' : 'passing',
    health: 'pending',
  };
};

export const getCheckDescription = (catalog, checkID) => {
  const check = findCheck(catalog, checkID);
  if (check) {
    return check.description;
  }
};
