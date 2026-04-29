import { useState } from 'react';
import Button from '../common/Button.jsx';

const RECORD_TYPES = [
  'LAB_REPORT',
  'PRESCRIPTION',
  'IMAGING',
  'DISCHARGE_SUMMARY',
  'VACCINATION',
  'CONSULTATION_NOTE',
  'SURGICAL_REPORT',
  'PATHOLOGY',
  'DENTAL',
  'OPHTHALMOLOGY',
  'OTHER',
];

function RecordUpload({ onUpload, isUploading }) {
  const [formState, setFormState] = useState({
    title: '',
    recordType: 'LAB_REPORT',
    hospitalName: '',
    recordDate: '',
    notes: '',
    file: null,
  });

  function updateField(event) {
    const { name, value, files } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: files ? files[0] : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!onUpload) {
      return;
    }

    await onUpload(formState);
    setFormState({
      title: '',
      recordType: 'LAB_REPORT',
      hospitalName: '',
      recordDate: '',
      notes: '',
      file: null,
    });
  }

  return (
    <form className="surface-card space-y-4 p-6" onSubmit={handleSubmit}>
      <div>
        <h3 className="section-title">Upload a new record</h3>
        <p className="section-copy mt-1">
          Keep files attached to the patient timeline so consented doctors can view the right
          snapshot when they need it.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="field-shell">
          <span className="field-label">Record title</span>
          <input
            className="field-input"
            name="title"
            value={formState.title}
            onChange={updateField}
            placeholder="CBC Report, MRI Summary, Vaccination Card"
            required
          />
        </label>

        <label className="field-shell">
          <span className="field-label">Record type</span>
          <select
            className="field-input"
            name="recordType"
            value={formState.recordType}
            onChange={updateField}
          >
            {RECORD_TYPES.map((recordType) => (
              <option key={recordType} value={recordType}>
                {recordType.replaceAll('_', ' ')}
              </option>
            ))}
          </select>
        </label>

        <label className="field-shell">
          <span className="field-label">Hospital or clinic</span>
          <input
            className="field-input"
            name="hospitalName"
            value={formState.hospitalName}
            onChange={updateField}
            placeholder="Apollo, Fortis, local diagnostic center"
          />
        </label>

        <label className="field-shell">
          <span className="field-label">Record date</span>
          <input
            className="field-input"
            type="datetime-local"
            name="recordDate"
            value={formState.recordDate}
            onChange={updateField}
          />
        </label>
      </div>

      <label className="field-shell">
        <span className="field-label">Attach file</span>
        <input
          className="field-input file:mr-4 file:rounded-full file:border-0 file:bg-medilink-mintSoft file:px-4 file:py-2 file:font-semibold file:text-medilink-mint"
          type="file"
          name="file"
          onChange={updateField}
          required
        />
      </label>

      <label className="field-shell">
        <span className="field-label">Notes</span>
        <textarea
          className="field-input min-h-28"
          name="notes"
          value={formState.notes}
          onChange={updateField}
          placeholder="Optional context for the next doctor viewing this file."
        />
      </label>

      <Button type="submit" disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload record'}
      </Button>
    </form>
  );
}

export default RecordUpload;
