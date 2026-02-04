export function normalizeRoleKey(value?: string | null): string {
  return (value ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s._-]+/g, "");
}

const ROLE_RANK: Record<string, number> = {
  brandowner: 4,
  locationowner: 4,
  admin: 3,
  storemanager: 2,
};

export function getRoleRank(value?: string | null): number {
  const key = normalizeRoleKey(value);
  return ROLE_RANK[key] ?? 1;
}

export function isProtectedRole(value?: string | null): boolean {
  const key = normalizeRoleKey(value);
  return key === "brandowner" || key === "locationowner";
}

export function canManageUsers(value?: string | null): boolean {
  const key = normalizeRoleKey(value);
  return key === "brandowner" || key === "locationowner" || key === "admin" || key === "storemanager";
}

export function canEditTarget(sessionRole?: string | null, targetRole?: string | null): boolean {
  if (!canManageUsers(sessionRole)) return false;
  if (isProtectedRole(targetRole)) return false;
  return getRoleRank(sessionRole) > getRoleRank(targetRole);
}

export function sortRolesByHierarchy<T extends { label: string }>(roles: T[]): T[] {
  return [...roles].sort((a, b) => {
    const rankDiff = getRoleRank(b.label) - getRoleRank(a.label);
    if (rankDiff !== 0) return rankDiff;
    return a.label.localeCompare(b.label);
  });
}

export function filterAssignableRoles<T extends { label: string }>(
  roles: T[],
  sessionRole?: string | null
): T[] {
  if (!sessionRole) {
    return roles.filter((role) => !isProtectedRole(role.label));
  }
  const sessionRank = getRoleRank(sessionRole);
  return roles.filter((role) => {
    if (isProtectedRole(role.label)) return false;
    return getRoleRank(role.label) < sessionRank;
  });
}
