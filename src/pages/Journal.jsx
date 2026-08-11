import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import VoiceRecorder from '../components/VoiceRecorder';

// Temporary frontend-only save.
// This will later be replaced with the backend API.
async function saveEntry(text) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!text.trim()) {
    throw new Error('empty');
  }

  return {
    id: crypto.randomUUID(),
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };
}

export default function Journal() {
  const [entryText, setEntryText] = useState('');
  const [entries, setEntries] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    setError('');

    if (!entryText.trim()) {
      setError('Please write something before saving.');
      return;
    }

    setSaving(true);

    try {
      const savedEntry = await saveEntry(entryText);

      setEntries((previousEntries) => [
        savedEntry,
        ...previousEntries,
      ]);

      setEntryText('');
    } catch (err) {
      setError('Could not save your journal entry. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">

      {/* Page heading */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-ink">
          Journal
        </h1>

        <p className="mt-1 text-sm text-ink/60">
          Write about your day, your progress, or record a voice entry.
        </p>
      </div>

      {/* Voice Journal Prototype Section */}
      <VoiceRecorder />

      {/* Journal input */}
      <Card className="mb-8">

        <h2 className="mb-3 text-lg font-semibold text-ink">
          New journal entry
        </h2>

        <textarea
          value={entryText}
          onChange={(e) => setEntryText(e.target.value)}
          placeholder="Write your thoughts here..."
          rows={8}
          disabled={saving}
          className="
            w-full resize-none rounded-card border border-line
            bg-paper p-4 text-sm text-ink
            placeholder:text-ink/40
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-moss-500
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        />

        {/* Error message */}
        {error && (
          <p
            role="alert"
            className="mt-3 text-sm text-ember"
          >
            {error}
          </p>
        )}

        {/* Save button */}
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleSave}
            loading={saving}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Journal'}
          </Button>
        </div>

      </Card>

      {/* Journal history */}
      <section>

        <h2 className="mb-4 text-xl font-semibold text-ink">
          Journal History
        </h2>

        {entries.length === 0 ? (
          <Card>
            <p className="text-center text-sm text-ink/50">
              No journal entries yet.
            </p>

            <p className="mt-1 text-center text-xs text-ink/40">
              Your saved entries will appear here.
            </p>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">

            {entries.map((entry) => (
              <Card key={entry.id}>

                <p className="mb-2 text-xs text-ink/50">
                  {new Date(entry.createdAt).toLocaleString()}
                </p>

                <p className="whitespace-pre-wrap text-sm leading-6 text-ink/90">
                  {entry.text}
                </p>

              </Card>
            ))}

          </div>
        )}

      </section>

    </div>
  );
}