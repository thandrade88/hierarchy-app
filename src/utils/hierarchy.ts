import type { UserData, HierarchyUser } from "../types/user";

export default function buildHierarchyTree(users: UserData[], managerId?: number): HierarchyUser[] {
    return users
        .filter(user => user.managerId === managerId)
        .map(user => ({
            ...user,
            fullName: `${user.firstName} ${user.lastName}`,
            initials: `${user.firstName[0]}${user.lastName[0]}`,
            isManager: users.some(u => u.managerId === user.id),
            reports: buildHierarchyTree(users, user.id)
        }));
}
