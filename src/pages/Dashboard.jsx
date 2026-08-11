import Card from '../components/Card';

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-5xl">

      <h1 className="text-3xl font-bold text-ink">
        Dashboard
      </h1>

      <p className="mt-2 text-ink/60">
        Welcome to your Goal Journal.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">

        <Card>
          <h2 className="font-semibold">Journal</h2>
          <p className="mt-2 text-sm text-ink/60">
            Write and review your journal entries.
          </p>
        </Card>

        <Card>
          <h2 className="font-semibold">Goals</h2>
          <p className="mt-2 text-sm text-ink/60">
            Track the goals you want to achieve.
          </p>
        </Card>

        <Card>
          <h2 className="font-semibold">Progress</h2>
          <p className="mt-2 text-sm text-ink/60">
            Monitor your personal progress.
          </p>
        </Card>

      </div>

    </div>
  );
}