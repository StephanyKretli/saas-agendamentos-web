import type { PublicProfessionalProfile } from "../types/public-booking.types";

type ProfessionalHeaderProps = {
  profile: PublicProfessionalProfile;
};

export function ProfessionalHeader({
  profile,
}: ProfessionalHeaderProps) {
  const initials =
    profile.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "P";

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
          {initials}
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {profile.name}
          </h1>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
        </div>
      </div>

      {profile.bio ? (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {profile.bio}
        </p>
      ) : null}
    </div>
  );
}