import type { UserData } from "../types/user";

export default function buildHierarchyTree(users: UserData[]) {
    return users.filter(user => user.managerId === undefined).map((manager) => ({
        ...manager,
        fullName: `${manager.firstName} ${manager.lastName}`,
        initials: `${manager.firstName[0]}${manager.lastName[0]}`,
        isManager: true,
        isExpanded: false,
        reports: users.filter(user => user.managerId === manager.id).map((user) => ({
            ...user,
            fullName: `${user.firstName} ${user.lastName}`,
            initials: `${user.firstName[0]}${user.lastName[0]}`
        })),
    }));
}