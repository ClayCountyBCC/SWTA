async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers ?? {})
    },
    ...options
  });

  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response;
}

export async function getAssessment(pid) {
  const response = await requestJson(`/API/Assessments/${encodeURIComponent(pid)}`);
  const assessment = await response.json();

  if (!assessment || !assessment.PID) {
    throw new Error(`No assessment was returned for parcel ${pid}.`);
  }

  return assessment;
}

function buildAssessmentQuery(filters = {}) {
  const query = new URLSearchParams();
  const filterMap = {
    owner: 'owner',
    road: 'road',
    parcel: 'parcel',
    district: 'district',
    usedesc: 'usedesc',
    notes: 'notes'
  };

  Object.entries(filterMap).forEach(([filterName, queryName]) => {
    const value = filters[filterName];

    if (value !== undefined && value !== null && String(value).trim() !== '') {
      query.set(queryName, String(value).trim());
    }
  });

  query.set('alreadyworked', String(Boolean(filters.alreadyWorked)));

  if (Number(filters.queryType) > 0) {
    query.set('querytype', String(filters.queryType));
  }

  return query;
}

export async function getAssessments(filters = {}) {
  const query = buildAssessmentQuery(filters);
  const queryString = query.toString();
  const response = await requestJson(
    `/API/Assessments/${queryString.length > 0 ? `?${queryString}` : ''}`
  );

  return response.json();
}

export async function getAssessmentsPage(filters = {}, page = 1, pageSize = 50, includeTotalCount = true) {
  const query = buildAssessmentQuery(filters);
  query.set('page', String(page));
  query.set('pageSize', String(pageSize));
  query.set('includeTotalCount', String(Boolean(includeTotalCount)));

  const queryString = query.toString();
  const response = await requestJson(
    `/API/Assessments/page?${queryString}`
  );

  return response.json();
}

export async function getEnvironment() {
  const response = await requestJson('/API/Environment');
  return response.json();
}

export async function getLog(pid) {
  const response = await requestJson(`/API/Log/${encodeURIComponent(pid)}`);
  return response.json();
}

export async function saveAssessment(payload) {
  await requestJson('/API/Assessments/', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
