import { useState } from 'react';
import Button from '../common/Button.jsx';

function AccessRequestForm({ patientId = '', onSubmit, isSubmitting }) {
  const [formState, setFormState] = useState({
    patientId,
    reason: 'Consultation',
  });

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit?.(formState);
  }

  function updateField(event) {
    const { name, value } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
  }

  return (
    <form className="surface-card space-y-4 p-6" onSubmit={handleSubmit}>
      <div>
        <h3 className="section-title">Request patient consent</h3>
        <p className="section-copy mt-1">
          Send a documented reason for access before opening the patient record timeline.
        </p>
      </div>

      <label className="field-shell">
        <span className="field-label">Patient ID</span>
        <input
          className="field-input"
          name="patientId"
          value={formState.patientId}
          onChange={updateField}
          disabled={Boolean(patientId)}
          required
        />
      </label>

      <label className="field-shell">
        <span className="field-label">Clinical reason</span>
        <textarea
          className="field-input min-h-28"
          name="reason"
          value={formState.reason}
          onChange={updateField}
          placeholder="Why this patient record access is needed."
          required
        />
      </label>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Send access request'}
      </Button>
    </form>
  );
}

export default AccessRequestForm;
