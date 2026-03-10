type ProfessionalHeaderProps = {
  user: {
    id: string;
    name: string;
    username: string;
  };
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
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
          {initials}
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {displayName}
          </h1>
          <p className="text-sm text-muted-foreground">@{displayUsername}</p>
        </div>
      </div>
    </div>
  );
}