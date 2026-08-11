import Card from '../components/Card';

export default function Profile() {
  return (
    <div className="mx-auto max-w-5xl">

      <h1 className="text-3xl font-bold text-ink">
        Profile
      </h1>

      <p className="mt-2 text-ink/60">
        Manage your profile.
      </p>

      <Card className="mt-8">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-moss-100 text-xl">
            👤
          </div>

          <div>
            <h2 className="font-semibold">
              User Profile
            </h2>

            <p className="text-sm text-ink/60">
              Your profile information will appear here.
            </p>
          </div>

        </div>

      </Card>

    </div>
  );
}