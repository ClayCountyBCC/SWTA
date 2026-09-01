import { useEffect, useState } from 'react';
import { getLog, saveAssessment } from '../../services/solidWasteReactApi';
import {
  buildSaveNote,
  createSavePayload,
  getExemptionNote,
  getExemptionYear,
  getManualUpdateNote
} from './parcelDetailHelpers';

function ParcelDetailDialog({
  initialAssessmentData = [],
  initialIndex = 0,
  initialParcel = null,
  canNavigatePreviousPage = false,
  canNavigateNextPage = false,
  pageNavigationLoading = false,
  onPreviousPage = null,
  onNextPage = null,
  onSaved = null
}) {
  const initialSelectedParcel =
    initialParcel ?? initialAssessmentData[initialIndex] ?? null;

  const [parcel, setParcel] = useState(() =>
    initialSelectedParcel ? { ...initialSelectedParcel } : null
  );
  const [assessmentData, setAssessmentData] = useState(() =>
    initialAssessmentData.map((item) => ({ ...item }))
  );
  const [index, setIndex] = useState(initialIndex);
  const [notes, setNotes] = useState([]);
  const [noteToSave, setNoteToSave] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const nextParcel = initialParcel ?? initialAssessmentData[initialIndex] ?? null;
    setParcel(nextParcel ? { ...nextParcel } : null);
  }, [initialAssessmentData, initialIndex, initialParcel]);

  useEffect(() => {
    setAssessmentData(initialAssessmentData.map((item) => ({ ...item })));
  }, [initialAssessmentData]);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (!parcel || !parcel.PID) {
      setNotes([]);
      return;
    }

    setNotes([]);
    let cancelled = false;

    async function loadCurrentNotes() {
      try {
        const freshNotes = await getLog(parcel.PID);

        if (cancelled) {
          return;
        }

        setNotes(Array.isArray(freshNotes) ? freshNotes : []);
        setErrorMessage('');
      } catch (error) {
        if (!cancelled) {
          setNotes([]);
          setErrorMessage('Unable to load parcel notes.');
        }
      }
    }

    loadCurrentNotes();

    return () => {
      cancelled = true;
    };
  }, [parcel?.PID]);

  function updateCurrentParcel(nextParcel) {
    setParcel(nextParcel);
    setAssessmentData((current) => {
      if (index < 0 || index >= current.length) {
        return current;
      }

      const nextItems = current.slice();
      nextItems[index] = nextParcel;
      return nextItems;
    });
  }

  function goToParcel(nextIndex) {
    if (nextIndex < 0 || nextIndex >= assessmentData.length) {
      return;
    }

    setIndex(nextIndex);
    setNotes([]);
    setParcel(assessmentData[nextIndex] ? { ...assessmentData[nextIndex] } : null);
  }

  async function reloadCurrentNotes(pid) {
    try {
      const freshNotes = await getLog(pid);
      setNotes(Array.isArray(freshNotes) ? freshNotes : []);
    } catch (error) {
      setErrorMessage('Unable to load parcel notes.');
    }
  }

  async function saveData({
    collectedUnits,
    assessedUnits,
    baseNote,
    exemptionType = '',
    removeExemption = false
  }) {
    if (!parcel || !parcel.PID) {
      return;
    }

    const note = buildSaveNote(parcel, baseNote, noteToSave);
    const payload = createSavePayload(parcel, {
      collectedUnits,
      assessedUnits,
      note,
      exemptionType,
      removeExemption
    });

    setSaving(true);
    setErrorMessage('');

    try {
      await saveAssessment(payload);

      const nextParcel = {
        ...parcel,
        Collected_Units: collectedUnits,
        Assessed_Units: assessedUnits,
        Notes: note,
        HasHardshipExemption:
          exemptionType === 'HS' ? !removeExemption : parcel.HasHardshipExemption,
        HasVeteranExemption:
          exemptionType === 'VX' ? !removeExemption : parcel.HasVeteranExemption
      };

      updateCurrentParcel(nextParcel);

      await reloadCurrentNotes(parcel.PID);
      setNoteToSave('');

      if (onSaved) {
        onSaved(nextParcel);
      }
    } catch (error) {
      setErrorMessage('Unable to save parcel update.');
    } finally {
      setSaving(false);
    }
  }

  function saveManual() {
    saveData({
      collectedUnits: parcel?.Collected_Units ?? 0,
      assessedUnits: parcel?.Assessed_Units ?? 0,
      baseNote: getManualUpdateNote(parcel)
    });
  }

  function saveHardship() {
    const removeExemption = Boolean(parcel?.HasHardshipExemption);
    const collectedUnits = parcel?.Collected_Units ?? 0;
    const assessedUnits = removeExemption ? collectedUnits : collectedUnits - 1;

    saveData({
      collectedUnits,
      assessedUnits,
      baseNote: getExemptionNote(parcel, 'HS', removeExemption),
      exemptionType: 'HS',
      removeExemption
    });
  }

  function saveVeteran() {
    const removeExemption = Boolean(parcel?.HasVeteranExemption);

    saveData({
      collectedUnits: parcel?.Collected_Units ?? 0,
      assessedUnits: parcel?.Assessed_Units ?? 0,
      baseNote: getExemptionNote(parcel, 'VX', removeExemption),
      exemptionType: 'VX',
      removeExemption
    });
  }

  function saveReclassification() {
    saveData({
      collectedUnits: 0,
      assessedUnits: 0,
      baseNote: `Reclassified Commercial ${getExemptionYear(parcel)}`
    });
  }

  const hasParcel = Boolean(parcel && parcel.PID);
  const hasPreviousParcel = index > 0 || canNavigatePreviousPage;
  const hasNextParcel = index < assessmentData.length - 1 || canNavigateNextPage;
  const hardshipButtonLabel = parcel?.HasHardshipExemption
    ? 'Remove - Hardship'
    : 'Add - Hardship';
  const veteranButtonLabel = parcel?.HasVeteranExemption
    ? 'Remove - Veterans'
    : 'Add - Veterans';

  if (!hasParcel) {
    return (
      <section className="parcel-detail">
        <div className="parcel-detail__empty">No parcel is selected.</div>
      </section>
    );
  }

  return (
    <section className="parcel-detail">
      <header className="parcel-detail__header">
        <div>
          <p className="parcel-detail__eyebrow">Parcel Detail</p>
          <h1 className="parcel-detail__title">{parcel.PID}</h1>
        </div>
        <div className="parcel-detail__status">
          {saving ? 'Saving...' : `Data year ${parcel.DataYear}`}
        </div>
      </header>

      <div className="parcel-detail__grid">
        <section className="parcel-detail__panel">
          <div className="field-grid field-grid--top">
            <label className="field">
              <span>PID</span>
              <input readOnly value={parcel.PID ?? ''} />
            </label>
            <label className="field">
              <span>Tax District</span>
              <input readOnly value={parcel.TaxDist ?? ''} />
            </label>
            <label className="field field--wide">
              <span>Owner</span>
              <input readOnly value={parcel.OWNER_NAME ?? ''} />
            </label>
            <label className="field">
              <span>House #</span>
              <input readOnly value={parcel.HOUSE_NO ?? ''} />
            </label>
            <label className="field field--wide">
              <span>Street</span>
              <input readOnly value={parcel.STREET ?? ''} />
            </label>
          </div>

          <div className="field-grid field-grid--summary">
            <label className="field">
              <span>{parcel.Prev_DataYear ?? ''} UseDesc</span>
              <input readOnly value={parcel.Prev_USEDESC ?? ''} />
            </label>
            <label className="field">
              <span>{parcel.Prev_DataYear ?? ''} Taxable</span>
              <input readOnly value={parcel.Prev_Total_Taxable ?? ''} />
            </label>
            <label className="field">
              <span>{parcel.DataYear ?? ''} UseDesc</span>
              <input readOnly value={parcel.USEDESC ?? ''} />
            </label>
            <label className="field">
              <span>{parcel.DataYear ?? ''} Taxable</span>
              <input readOnly value={parcel.Total_Taxable ?? ''} />
            </label>
          </div>

          <div className="parcel-detail__editor">
            <label className="field">
              <span>Assessed Collections</span>
              <input
                inputMode="numeric"
                type="number"
                value={parcel.Collected_Units ?? ''}
                onChange={(event) => {
                  const nextValue = event.target.value === ''
                    ? ''
                    : Number(event.target.value);

                  updateCurrentParcel({
                    ...parcel,
                    Collected_Units: nextValue === '' ? 0 : nextValue
                  });
                }}
              />
            </label>

            <label className="field">
              <span>Assessed Units</span>
              <input
                inputMode="numeric"
                type="number"
                value={parcel.Assessed_Units ?? ''}
                onChange={(event) => {
                  const nextValue = event.target.value === ''
                    ? ''
                    : Number(event.target.value);

                  updateCurrentParcel({
                    ...parcel,
                    Assessed_Units: nextValue === '' ? 0 : nextValue
                  });
                }}
              />
            </label>

            <label className="field field--wide">
              <span>Optional note to add</span>
              <input
                maxLength={250}
                type="text"
                value={noteToSave}
                onChange={(event) => setNoteToSave(event.target.value)}
              />
            </label>
          </div>

          {errorMessage ? (
            <div className="parcel-detail__error">{errorMessage}</div>
          ) : null}
        </section>

        <section className="parcel-detail__panel parcel-detail__notes">
          <div className="notes-header">
            <span>Note</span>
            <span>Date Added</span>
            <span>Bld/Col/Asd</span>
          </div>

          <div className="notes-list">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div className="notes-row" key={`${note.PID}-${note.addedOn_string}-${note.Note}`}>
                  <span>{note.Note}</span>
                  <span>{note.addedOn_string}</span>
                  <span>
                    {note.building_units ?? note.Building_Units ?? ''}/
                    {note.collected_units ?? note.Collected_Units ?? ''}/
                    {note.assessed_units ?? note.Assessed_Units ?? ''}
                  </span>
                </div>
              ))
            ) : (
              <div className="notes-empty">No notes found.</div>
            )}
          </div>
        </section>
      </div>

      <footer className="parcel-detail__actions">
        <button
          type="button"
          disabled={!hasPreviousParcel || saving || pageNavigationLoading}
          onClick={() => (index > 0 ? goToParcel(index - 1) : onPreviousPage?.())}
        >
          View Previous
        </button>
        <button type="button" disabled={saving} onClick={saveHardship}>
          {hardshipButtonLabel}
        </button>
        <button type="button" disabled={saving} onClick={saveVeteran}>
          {veteranButtonLabel}
        </button>
        <button type="button" disabled={saving} onClick={saveReclassification}>
          Update - Reclassification
        </button>
        <button type="button" disabled={saving} onClick={saveManual}>
          Update
        </button>
        <button
          type="button"
          disabled={!hasNextParcel || saving || pageNavigationLoading}
          onClick={() => (
            index < assessmentData.length - 1
              ? goToParcel(index + 1)
              : onNextPage?.()
          )}
        >
          View Next
        </button>
      </footer>
    </section>
  );
}

export default ParcelDetailDialog;
