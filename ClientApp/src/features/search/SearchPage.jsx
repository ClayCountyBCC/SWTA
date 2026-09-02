import { useEffect, useRef, useState } from 'react';
import AppearancePanel from '../appearance/AppearancePanel';
import ParcelDetailDialog from '../parcelDetail/ParcelDetailDialog';
import { getAssessmentsPage, getEnvironment } from '../../services/solidWasteReactApi';

const initialFilters = {
  owner: '',
  road: '',
  parcel: '',
  district: '',
  usedesc: '',
  notes: '',
  alreadyWorked: true,
  queryType: 0
};

const defaultResultPageSize = 50;
const resultPageSizeOptions = [10, 25, 50, 100];

const quickFilters = [
  { label: 'Hardship', queryType: 3 },
  { label: 'Veteran', queryType: 4 },
  { label: 'Reclassified', queryType: 10 },
  { label: 'Year-to-year difference', queryType: 5 },
  { label: 'New parcels', queryType: 8 },
  { label: 'Removed this year', queryType: 9 }
];

const reports = [
  {
    label: 'Solid Waste Roll',
    href: 'http://claybcrpt/reports/report/Environmental%20Services/SolidWasteRoll'
  },
  {
    label: 'Solid Waste (Internal)',
    href: 'http://claybcrpt/reports/report/Environmental%20Services/SolidWasteRoll%20(Internal)'
  },
  {
    label: 'Paid Solid Waste Fees',
    href: 'http://claybcrpt/reports/report/Environmental%20Services/Paid%20Solid%20Waste%20Fees'
  }
];

function SearchPage() {
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [rows, setRows] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultResultPageSize);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [appliedFilter, setAppliedFilter] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [showReports, setShowReports] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isProduction, setIsProduction] = useState(true);
  const [loading, setLoading] = useState(false);
  const [modalPageLoading, setModalPageLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const requestId = useRef(0);
  const mounted = useRef(true);
  const pageCache = useRef(new Map());

  function getPageCacheKey(filters, requestedPage, requestedPageSize) {
    return JSON.stringify({
      filters,
      page: requestedPage,
      pageSize: requestedPageSize
    });
  }

  function getCachedPage(filters, requestedPage, requestedPageSize, includeTotalCount) {
    const cacheKey = getPageCacheKey(filters, requestedPage, requestedPageSize);
    const cachedPage = pageCache.current.get(cacheKey);

    if (cachedPage) {
      return cachedPage;
    }

    const pageRequest = getAssessmentsPage(
      filters,
      requestedPage,
      requestedPageSize,
      includeTotalCount
    ).catch((error) => {
      // Do not keep failed requests in the cache. A later navigation can retry them.
      if (pageCache.current.get(cacheKey) === pageRequest) {
        pageCache.current.delete(cacheKey);
      }

      throw error;
    });

    pageCache.current.set(cacheKey, pageRequest);
    return pageRequest;
  }

  function clearPageCache() {
    pageCache.current.clear();
  }

  function preloadPage(filters, requestedPage, requestedPageSize) {
    if (requestedPage < 1) {
      return;
    }

    getCachedPage(filters, requestedPage, requestedPageSize, false).catch(() => {
      // The visible page request will report an error if the user navigates to it.
    });
  }

  function preloadAdjacentPages(filters, currentPage, currentPageSize, canLoadNextPage) {
    preloadPage(filters, currentPage - 1, currentPageSize);

    if (canLoadNextPage) {
      preloadPage(filters, currentPage + 1, currentPageSize);
    }
  }

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    getEnvironment()
      .then((environment) => {
        if (mounted.current) {
          setIsProduction(environment?.isProduction !== false);
        }
      })
      .catch(() => {
        // Keep the banner hidden when the environment check cannot be confirmed.
        if (mounted.current) {
          setIsProduction(true);
        }
      });

  }, []);

  useEffect(() => {
    if (selectedIndex === null) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedIndex]);

  async function loadRows(nextFilters, filterLabel, requestedPage = 1, requestedPageSize = pageSize, includeTotalCount = true) {
    const currentRequestId = requestId.current + 1;
    requestId.current = currentRequestId;
    const nextPage = Math.max(1, requestedPage);
    const nextPageSize = Math.max(1, requestedPageSize);
    setHasSearched(true);
    setLoading(true);
    setErrorMessage('');

    try {
      const pageResult = await getCachedPage(
        nextFilters,
        nextPage,
        nextPageSize,
        includeTotalCount
      );

      if (!mounted.current || currentRequestId !== requestId.current) {
        return;
      }

      const pageItems = Array.isArray(pageResult)
        ? pageResult
        : pageResult?.Items ?? pageResult?.items;

      if (!Array.isArray(pageItems)) {
        throw new Error('The assessment response was not a list.');
      }

      const returnedTotalCount = pageResult?.TotalCount ?? pageResult?.totalCount;
      const returnedPage = pageResult?.Page ?? pageResult?.page ?? nextPage;
      const returnedPageSize = pageResult?.PageSize ?? pageResult?.pageSize ?? nextPageSize;
      const returnedHasNextPage = pageResult?.HasNextPage
        ?? pageResult?.hasNextPage
        ?? pageItems.length > nextPageSize;

      setRows(pageItems);
      if (returnedTotalCount !== undefined && returnedTotalCount !== null) {
        setTotalCount(Number(returnedTotalCount) || 0);
      }
      setPage(Number(returnedPage) || nextPage);
      setPageSize(Number(returnedPageSize) || nextPageSize);
      setHasNextPage(Boolean(returnedHasNextPage));
      setAppliedFilters({ ...nextFilters });
      setAppliedFilter(filterLabel);

      preloadAdjacentPages(
        nextFilters,
        Number(returnedPage) || nextPage,
        Number(returnedPageSize) || nextPageSize,
        Boolean(returnedHasNextPage)
      );
    } catch (error) {
      if (mounted.current && currentRequestId === requestId.current) {
        setRows([]);
        setTotalCount(0);
        setHasNextPage(false);
        setErrorMessage('Unable to load parcel data. Check the server connection and try again.');
      }
    } finally {
      if (mounted.current && currentRequestId === requestId.current) {
        setLoading(false);
      }
    }
  }

  function updateFilter(name, value) {
    setDraftFilters((current) => ({ ...current, [name]: value, queryType: 0 }));
  }

  function handleSearch(event) {
    event.preventDefault();
    setShowReports(false);
    clearPageCache();
    loadRows(draftFilters, '', 1, pageSize, true);
  }

  function resetFilters() {
    setDraftFilters(initialFilters);
    setShowReports(false);
    clearPageCache();
    loadRows(initialFilters, '', 1, pageSize, true);
  }

  function applyQuickFilter(filter) {
    const nextFilters = { ...draftFilters, queryType: filter.queryType };
    setDraftFilters(nextFilters);
    setShowReports(false);
    clearPageCache();
    loadRows(nextFilters, filter.label, 1, pageSize, true);
  }

  function clearQuickFilter() {
    const nextFilters = { ...draftFilters, queryType: 0 };
    setDraftFilters(nextFilters);
    setShowReports(false);
    clearPageCache();
    loadRows(nextFilters, '', 1, pageSize, true);
  }

  function openParcel(index) {
    setSelectedIndex(index);
  }

  async function changeModalPage(direction) {
    if (selectedIndex === null || modalPageLoading) {
      return;
    }

    const nextPage = page + direction;
    if (nextPage < 1 || (direction > 0 && !hasNextPage)) {
      return;
    }

    setModalPageLoading(true);
    setErrorMessage('');

    try {
      const pageResult = await getCachedPage(appliedFilters, nextPage, pageSize, false);
      const pageItems = Array.isArray(pageResult)
        ? pageResult
        : pageResult?.Items ?? pageResult?.items;

      if (!Array.isArray(pageItems) || pageItems.length === 0) {
        throw new Error('The assessment response did not contain a parcel page.');
      }

      const returnedPage = pageResult?.Page ?? pageResult?.page ?? nextPage;
      const returnedPageSize = pageResult?.PageSize ?? pageResult?.pageSize ?? pageSize;
      const returnedHasNextPage = pageResult?.HasNextPage
        ?? pageResult?.hasNextPage
        ?? pageItems.length > pageSize;

      setRows(pageItems);
      setPage(Number(returnedPage) || nextPage);
      setPageSize(Number(returnedPageSize) || pageSize);
      setHasNextPage(Boolean(returnedHasNextPage));
      setSelectedIndex(direction > 0 ? 0 : pageItems.length - 1);

      preloadAdjacentPages(
        appliedFilters,
        Number(returnedPage) || nextPage,
        Number(returnedPageSize) || pageSize,
        Boolean(returnedHasNextPage)
      );
    } catch (error) {
      setErrorMessage('Unable to load the adjacent parcel page.');
    } finally {
      if (mounted.current) {
        setModalPageLoading(false);
      }
    }
  }

  function closeParcel() {
    setSelectedIndex(null);
    clearPageCache();
    loadRows(appliedFilters, appliedFilter, page, pageSize, false);
  }

  function handleParcelSaved(updatedParcel) {
    if (!updatedParcel?.PID) {
      return;
    }

    clearPageCache();
    setRows((current) => current.map((row) => (
      row.PID === updatedParcel.PID ? { ...row, ...updatedParcel } : row
    )));
  }

  function handlePageSizeChange(event) {
    const nextPageSize = Number(event.target.value);

    setPageSize(nextPageSize);

    if (hasSearched) {
      clearPageCache();
      loadRows(appliedFilters, appliedFilter, 1, nextPageSize, true);
    }
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const firstResult = totalCount === 0 ? 0 : ((page - 1) * pageSize) + 1;
  const lastResult = Math.min(page * pageSize, totalCount);

  function goToPage(nextPage) {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page || loading || (nextPage > page && !hasNextPage)) {
      return;
    }

    loadRows(appliedFilters, appliedFilter, nextPage, pageSize, false);
  }

  function renderPagination(position) {
    if (!hasSearched || totalCount === 0) {
      return null;
    }

    return (
      <nav className={`pagination ${position === 'top' ? 'pagination--top' : ''}`} aria-label={`Parcel result pages (${position})`}>
        <div className="pagination__actions pagination__actions--left">
          <button type="button" onClick={() => goToPage(1)} disabled={loading || page === 1}>
            First
          </button>
          <button type="button" onClick={() => goToPage(page - 1)} disabled={loading || page === 1}>
            Previous
          </button>
        </div>
        <div className="pagination__summary">
          <strong className="pagination__page-label">Page {page} of {totalPages}</strong>
          <span className="pagination__range">Showing {firstResult}-{lastResult}</span>
          <label className="page-size-control">
            <span>Rows per page</span>
            <select value={pageSize} onChange={handlePageSizeChange} disabled={loading}>
              {resultPageSizeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="pagination__actions pagination__actions--right">
          <button type="button" onClick={() => goToPage(page + 1)} disabled={loading || page === totalPages || !hasNextPage}>
            Next
          </button>
          <button type="button" onClick={() => goToPage(totalPages)} disabled={loading || page === totalPages}>
            Last
          </button>
        </div>
      </nav>
    );
  }

  return (
    <div className={`app-frame ${!isProduction ? 'app-frame--development' : ''}`}>
      {!isProduction ? (
        <div className="development-banner" role="status" aria-live="polite">
          <strong>Development Environment</strong>
          <span>This is not the production IIS server.</span>
        </div>
      ) : null}

      <header className="app-header">
        <div className="app-header__brand">
          <img className="brand-seal" src="./Seal400Transparent.png" alt="Clay County Florida seal" />
          <div>
            <h1>Solid Waste Tax Assessment</h1>
          </div>
        </div>

        <div className="app-header__actions">
          <button
            type="button"
            className="button button--header"
            onClick={() => {
              setShowReports((current) => !current);
              setShowAppearance(false);
            }}
            aria-expanded={showReports}
          >
            Reports
          </button>
          <button
            type="button"
            className="button button--header"
            onClick={() => {
              setShowFilters((current) => !current);
              setShowAppearance(false);
            }}
            aria-expanded={showFilters}
          >
            Filters
          </button>
          <button
            type="button"
            className="button button--header"
            onClick={() => {
              setShowAppearance((current) => !current);
              setShowReports(false);
            }}
            aria-expanded={showAppearance}
            aria-controls="appearance-panel"
          >
            Appearance
          </button>
        </div>
      </header>

      {showReports ? (
        <aside className="menu-panel menu-panel--reports" aria-label="Reports">
          <div className="menu-panel__heading">
            <span className="section-kicker">Reports</span>
            <button type="button" className="icon-button" onClick={() => setShowReports(false)} aria-label="Close reports">
              x
            </button>
          </div>
          {reports.map((report) => (
            <a key={report.label} href={report.href} target="_blank" rel="noreferrer">
              {report.label}
              <span aria-hidden="true">-&gt;</span>
            </a>
          ))}
        </aside>
      ) : null}

      {showAppearance ? <AppearancePanel onClose={() => setShowAppearance(false)} /> : null}

      <main className="app-content">
        {showFilters ? (
          <section className="filter-card" aria-label="Parcel filters">
            <div className="filter-card__heading">
              <div>
                <p className="section-kicker">Find a parcel</p>
                <h3>Search filters</h3>
              </div>
              <span className="filter-card__hint">Use one or more fields</span>
            </div>

            <form onSubmit={handleSearch}>
              <div className="filter-grid">
                <label className="form-field">
                  <span>Owner name</span>
                  <input value={draftFilters.owner} onChange={(event) => updateFilter('owner', event.target.value)} />
                </label>
                <label className="form-field">
                  <span>Road</span>
                  <input value={draftFilters.road} onChange={(event) => updateFilter('road', event.target.value)} />
                </label>
                <label className="form-field">
                  <span>Parcel</span>
                  <input value={draftFilters.parcel} onChange={(event) => updateFilter('parcel', event.target.value)} />
                </label>
                <label className="form-field">
                  <span>Use description</span>
                  <input value={draftFilters.usedesc} onChange={(event) => updateFilter('usedesc', event.target.value)} />
                </label>
                <label className="form-field">
                  <span>Tax district</span>
                  <input inputMode="numeric" value={draftFilters.district} onChange={(event) => updateFilter('district', event.target.value)} />
                </label>
                <label className="form-field">
                  <span>Notes</span>
                  <input value={draftFilters.notes} onChange={(event) => updateFilter('notes', event.target.value)} />
                </label>
              </div>

              <div className="filter-card__footer">
                <label className="checkbox-field">
                  <input
                    type="checkbox"
                    checked={draftFilters.alreadyWorked}
                    onChange={(event) => setDraftFilters((current) => ({
                      ...current,
                      alreadyWorked: event.target.checked,
                      queryType: 0
                    }))}
                  />
                  <span>Hide reviewed parcels</span>
                </label>
                <div className="filter-card__actions">
                  <button type="button" className="button button--quiet" onClick={resetFilters} disabled={loading}>
                    Reset
                  </button>
                  <button type="submit" className="button button--primary" disabled={loading}>
                    {loading ? 'Searching...' : 'Search parcels'}
                  </button>
                </div>
              </div>
            </form>
          </section>
        ) : null}

        <section className="quick-filter-card" aria-label="Quick filters">
          <div>
            <p className="section-kicker">Saved views</p>
            <h3>Quick filters</h3>
          </div>
          <div className="quick-filter-list">
            {quickFilters.map((filter) => {
              const isActive = appliedFilter === filter.label
                && appliedFilters.queryType === filter.queryType;

              return (
                <button
                  key={filter.label}
                  type="button"
                  className={`quick-filter ${isActive ? 'quick-filter--active' : ''}`}
                  onClick={() => applyQuickFilter(filter)}
                  disabled={loading}
                  aria-pressed={isActive}
                >
                  {filter.label}
                </button>
              );
            })}
            {appliedFilter ? (
              <button
                type="button"
                className="quick-filter quick-filter--clear"
                onClick={clearQuickFilter}
                disabled={loading}
              >
                Clear saved view
              </button>
            ) : null}
          </div>
        </section>

        {errorMessage ? <div className="notice notice--error" role="alert">{errorMessage}</div> : null}

        <section className="results-card" aria-label="Parcel search results">
          <div className="results-card__heading">
            <div>
              <p className="section-kicker">Current results</p>
              <h3>Parcels</h3>
            </div>
            <div className="results-card__record-count" aria-live="polite">
              <span className="results-card__record-count-value">{loading ? '...' : totalCount}</span>
              <span className="results-card__record-count-label">records</span>
            </div>
          </div>

          {renderPagination('top')}

          <div className="results-table-wrap">
            <table className="results-table">
              <thead>
                <tr>
                  <th scope="col">PID</th>
                  <th scope="col">Owner name</th>
                  <th scope="col">Use description</th>
                  <th scope="col">District</th>
                  <th scope="col">Street</th>
                  <th scope="col">Notes</th>
                  <th scope="col">Bld / Col / Asd</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={`${row.PID}-${index}`}>
                    <td>
                      <button type="button" className="pid-link" onClick={() => openParcel(index)}>
                        {row.PID}
                      </button>
                    </td>
                    <td>{row.OWNER_NAME || '-'}</td>
                    <td>
                      {row.PIN_DSP ? (
                        <a
                          className="external-link"
                          target="_blank"
                          rel="noreferrer"
                          href={`https://qpublic.schneidercorp.com/Application.aspx?AppID=830&LayerID=15008&PageTypeID=4&KeyValue=${encodeURIComponent(row.PIN_DSP)}`}
                        >
                          {row.USEDESC || '-'}
                        </a>
                      ) : (row.USEDESC || '-')}
                    </td>
                    <td>{row.TaxDist ?? '-'}</td>
                    <td>{row.STREET || '-'}</td>
                    <td className="results-table__notes">{row.Notes || '-'}</td>
                    <td>{row.Building_Units ?? 0} / {row.Collected_Units ?? 0} / {row.Assessed_Units ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading && rows.length === 0 && !errorMessage ? (
              <div className="results-empty">
                <strong>{hasSearched ? 'No parcels match the current filters.' : 'Search to load parcel data.'}</strong>
                <span>{hasSearched ? 'Adjust the search fields or reset the filters to try again.' : 'Enter a filter or select Search parcels to begin.'}</span>
              </div>
            ) : null}
          </div>

          {renderPagination('bottom')}
        </section>
      </main>

      {selectedIndex !== null && rows[selectedIndex] ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={closeParcel}>
          <div className="modal-window" role="dialog" aria-modal="true" aria-labelledby="parcel-dialog-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-window__header">
              <div>
                <p className="section-kicker">Parcel detail</p>
                <h2 id="parcel-dialog-title">{rows[selectedIndex].PID}</h2>
              </div>
              <button type="button" className="icon-button icon-button--large" onClick={closeParcel} aria-label="Close parcel detail">
                x
              </button>
            </div>
            <ParcelDetailDialog
              key={rows[selectedIndex].PID}
              initialAssessmentData={rows}
              initialIndex={selectedIndex}
              initialParcel={rows[selectedIndex]}
              canNavigatePreviousPage={page > 1}
              canNavigateNextPage={hasNextPage}
              pageNavigationLoading={modalPageLoading}
              onPreviousPage={() => changeModalPage(-1)}
              onNextPage={() => changeModalPage(1)}
              onSaved={handleParcelSaved}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default SearchPage;
