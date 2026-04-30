import { useEffect, useState } from 'react';
import Button from '../common/Button.jsx';

function splitList(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function EmergencyProfile({ profile, onSave, isSaving }) {
  const [formState, setFormState] = useState({
    bloodGroup: '',
    allergies: '',
    currentMedications: '',
    chronicConditions: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    occupation: '',
    languagePreference: '',
    nationality: '',
    address: '',
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormState({
      bloodGroup: profile?.bloodGroup || '',
      allergies: (profile?.allergies || []).join(', '),
      currentMedications: (profile?.currentMedications || []).join(', '),
      chronicConditions: (profile?.chronicConditions || []).join(', '),
      emergencyContactName: profile?.emergencyContact?.name || '',
      emergencyContactPhone: profile?.emergencyContact?.phone || '',
      emergencyContactRelation: profile?.emergencyContact?.relation || '',
      instagram: profile?.socialLinks?.instagram || '',
      facebook: profile?.socialLinks?.facebook || '',
      linkedin: profile?.socialLinks?.linkedin || '',
      occupation: profile?.occupation || '',
      languagePreference: profile?.languagePreference || '',
      nationality: profile?.nationality || '',
      address: profile?.address || '',
    });
  }, [profile]);

  function updateField(event) {
    const { name, value } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await onSave?.({
      ...profile,
      bloodGroup: formState.bloodGroup,
      allergies: splitList(formState.allergies),
      currentMedications: splitList(formState.currentMedications),
      chronicConditions: splitList(formState.chronicConditions),
      occupation: formState.occupation,
      languagePreference: formState.languagePreference,
      nationality: formState.nationality,
      address: formState.address,
      emergencyContact: {
        name: formState.emergencyContactName,
        phone: formState.emergencyContactPhone,
        relation: formState.emergencyContactRelation,
      },
      socialLinks: {
        instagram: formState.instagram,
        facebook: formState.facebook,
        linkedin: formState.linkedin,
      },
    });
  }

  return (
    <form className="surface-card space-y-8 p-10" onSubmit={handleSubmit}>
      <div className="border-b border-medilink-border pb-6">
        <h3 className="text-2xl font-display font-black text-medilink-ink">Clinical Identity</h3>
        <p className="text-medilink-muted text-sm mt-1">
          Life-saving data for emergency bypass events.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="field-shell">
          <span className="field-label">Blood group</span>
          <input
            className="field-input"
            name="bloodGroup"
            value={formState.bloodGroup}
            onChange={updateField}
            placeholder="B+, O-, AB+"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="field-shell">
            <span className="field-label">Emergency Contact</span>
            <input
              className="field-input"
              name="emergencyContactName"
              value={formState.emergencyContactName}
              onChange={updateField}
              placeholder="Name"
            />
          </label>
          <label className="field-shell">
            <span className="field-label">Relation</span>
            <input
              className="field-input"
              name="emergencyContactRelation"
              value={formState.emergencyContactRelation}
              onChange={updateField}
              placeholder="Spouse, Parent..."
            />
          </label>
        </div>

        <label className="field-shell">
          <span className="field-label">Emergency Phone</span>
          <input
            className="field-input"
            name="emergencyContactPhone"
            value={formState.emergencyContactPhone}
            onChange={updateField}
            placeholder="+91 98xxxxxx"
          />
        </label>
      </div>

      <div className="grid gap-6">
        <label className="field-shell">
          <span className="field-label">Allergies & Reactions</span>
          <textarea
            className="field-input min-h-24"
            name="allergies"
            value={formState.allergies}
            onChange={updateField}
            placeholder="Comma-separated list"
          />
        </label>
      </div>

      <div className="border-t border-medilink-border pt-8 space-y-6">
        <div>
          <h3 className="text-xl font-black text-medilink-ink">Personal Demographics</h3>
          <p className="text-xs text-medilink-muted">General information for standard clinical encounters.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <label className="field-shell">
            <span className="field-label">Occupation</span>
            <input
              className="field-input"
              name="occupation"
              value={formState.occupation}
              onChange={updateField}
              placeholder="Software Engineer, etc."
            />
          </label>
          <label className="field-shell">
            <span className="field-label">Primary Language</span>
            <input
              className="field-input"
              name="languagePreference"
              value={formState.languagePreference}
              onChange={updateField}
              placeholder="English, Hindi, etc."
            />
          </label>
          <label className="field-shell">
            <span className="field-label">Nationality</span>
            <input
              className="field-input"
              name="nationality"
              value={formState.nationality}
              onChange={updateField}
              placeholder="Indian"
            />
          </label>
        </div>

        <label className="field-shell">
          <span className="field-label">Residential Address</span>
          <textarea
            className="field-input min-h-20"
            name="address"
            value={formState.address}
            onChange={updateField}
            placeholder="Full mailing address"
          />
        </label>
      </div>

      <div className="border-t border-medilink-border pt-8 space-y-6">
        <div>
          <h3 className="text-xl font-black text-medilink-ink">Social Connectivity</h3>
          <p className="text-xs text-medilink-muted">Add your social handles for professional/personal verification.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <label className="field-shell">
            <span className="field-label">Instagram URL</span>
            <input
              className="field-input"
              name="instagram"
              value={formState.instagram}
              onChange={updateField}
              placeholder="instagram.com/handle"
            />
          </label>
          <label className="field-shell">
            <span className="field-label">Facebook URL</span>
            <input
              className="field-input"
              name="facebook"
              value={formState.facebook}
              onChange={updateField}
              placeholder="facebook.com/profile"
            />
          </label>
          <label className="field-shell">
            <span className="field-label">LinkedIn URL</span>
            <input
              className="field-input"
              name="linkedin"
              value={formState.linkedin}
              onChange={updateField}
              placeholder="linkedin.com/in/handle"
            />
          </label>
        </div>
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save emergency profile'}
      </Button>
    </form>
  );
}

export default EmergencyProfile;
