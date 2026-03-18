import { PublicBookingProfileResponse } from "../types/public-booking.types";

type ProfessionalHeaderProps = {
  user: PublicBookingProfileResponse["user"];
};

export function ProfessionalHeader({ user }: ProfessionalHeaderProps) {
  const displayName = user.name?.trim() || "Profissional";
  const displayUsername = user.username?.trim() || "sem-username";

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={displayName}
            className="h-20 w-20 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
            {initials}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {displayName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            @{displayUsername}
          </p>
        </div>
      </div>
    </div>
  );
}