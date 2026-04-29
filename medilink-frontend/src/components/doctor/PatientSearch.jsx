import Spinner from '../common/Spinner.jsx';

function PatientSearch({ query, onQueryChange, results, isLoading, onSelectPatient }) {
  return (
    <div className="surface-card space-y-4 p-6">
      <div>
        <h3 className="section-title">Patient search</h3>
        <p className="section-copy mt-1">
          Search by full name or exact Health ID. The debounce wiring is ready for the matching
          backend endpoint.
        </p>
      </div>

      <label className="field-shell">
        <span className="field-label">Name or Health ID</span>
        <input
          className="field-input"
          value={query}
          onChange={(event) => onQueryChange?.(event.target.value)}
          placeholder="Asha Rao or 14-digit Health ID"
        />
      </label>

      {isLoading ? <Spinner label="Searching patients..." /> : null}

      <div className="space-y-3">
        {results.length ? (
          results.map((patient) => (
            <button
              key={patient.id}
              type="button"
              onClick={() => onSelectPatient?.(patient)}
              className="w-full rounded-2xl border border-medilink-border px-4 py-3 text-left transition hover:border-medilink-mint hover:bg-medilink-mintSoft/50"
            >
              <p className="font-semibold text-medilink-ink">{patient.fullName}</p>
              <p className="text-sm text-medilink-muted">{patient.healthId}</p>
            </button>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-medilink-border px-4 py-6 text-sm text-medilink-muted">
            No patient matches yet. Wire the search endpoint and these results will populate.
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientSearch;
