import Card from '../components/Card';

export default function Goals() {
  return (
    <div className="mx-auto max-w-5xl">

      <h1 className="text-3xl font-bold text-ink">
        Goals
      </h1>

      <p className="mt-2 text-ink/60">
        Manage your personal goals.
      </p>

      <Card className="mt-8">
        <h2 className="text-lg font-semibold">
          No goals yet
        </h2>

        <p className="mt-2 text-sm text-ink/60">
          Your goals will appear here.
        </p>
      </Card>

    </div>
  );
}