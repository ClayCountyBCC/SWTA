export function getExemptionYear(parcel) {
  return parcel && parcel.DataYear ? String(parcel.DataYear) : '';
}

export function getManualUpdateNote(parcel) {
  const year = getExemptionYear(parcel);
  return year.length > 0 ? `Manual Update ${year}` : 'Manual Update';
}

export function getExemptionNote(parcel, exemptionType, removeExemption) {
  const year = getExemptionYear(parcel);
  const notePrefix = removeExemption ? 'Removed ' : 'Added ';
  const exemptionLabel =
    exemptionType === 'HS' ? 'Hardship Exemption' : 'Veteran Exemption';

  return year.length > 0
    ? `${notePrefix}${exemptionLabel} ${year}`
    : `${notePrefix}${exemptionLabel}`;
}

export function buildSaveNote(parcel, baseNote, noteToSave) {
  const trimmedBaseNote = (baseNote ?? '').trim();
  const trimmedNoteToSave = (noteToSave ?? '').trim();

  if (trimmedNoteToSave.length > 0) {
    return trimmedBaseNote.length > 0
      ? `${trimmedBaseNote} - ${trimmedNoteToSave}`
      : trimmedNoteToSave;
  }

  return trimmedBaseNote.length > 0
    ? trimmedBaseNote
    : getManualUpdateNote(parcel);
}

export function createSavePayload(parcel, changes) {
  return {
    PID: parcel.PID,
    DataYear: parcel.DataYear,
    Building_Units: parcel.Building_Units ?? 0,
    Collected_Units: changes.collectedUnits,
    Assessed_Units: changes.assessedUnits,
    Notes: changes.note,
    ExemptionType: changes.exemptionType ?? '',
    RemoveExemption: Boolean(changes.removeExemption)
  };
}
