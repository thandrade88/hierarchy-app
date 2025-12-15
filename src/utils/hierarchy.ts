import type { HierarchyUser } from "../types/user";

/**
 * Recursively builds a hierarchy tree of users based on their managerId.
 *
 * @param {HierarchyUser[]} users - The array of users to build the hierarchy tree from.
 * @param {number} [managerId] - The optional managerId to filter the users by.
 * @return {HierarchyUser[]} - The hierarchy tree of users.
 */

export default function buildHierarchyTree(users: HierarchyUser[], managerId?: number): HierarchyUser[] {
    return users
        .filter(user => user.managerId === managerId)
        .map(manager => ({
            ...manager,            
            reports: buildHierarchyTree(users, manager.id)
        }));
}
