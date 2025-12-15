import { describe, it, expect } from 'vitest';
import buildHierarchyTree from './hierarchy';
import type { HierarchyUser } from '../types/user';

const createMockUser = (id: number, firstName: string, lastName: string, email: string, managerId?: number): HierarchyUser => ({
    id,
    firstName,
    lastName,
    email,
    managerId,
    fullName: `${firstName} ${lastName}`,
    initials: `${firstName[0]}${lastName[0]}`,
    isManager: true,
});

describe('buildHierarchyTree', () => {
    const mockUsers: HierarchyUser[] = [
        createMockUser(1, 'John', 'Doe', 'john@example.com'),
        createMockUser(2, 'Jane', 'Smith', 'jane@example.com', 1),
        createMockUser(3, 'Bob', 'Johnson', 'bob@example.com', 1),
        createMockUser(4, 'Alice', 'Brown', 'alice@example.com', 2),
        createMockUser(5, 'Charlie', 'Wilson', 'charlie@example.com', 2),
    ];

    it('should build an empty tree for empty input', () => {
        const result = buildHierarchyTree([]);
        expect(result).toEqual([]);
    });

    it('should build a flat tree when no manager relationships exist', () => {
        const flatUsers = [
            createMockUser(1, 'John', 'Doe', 'john@example.com'),
            createMockUser(2, 'Jane', 'Smith', 'jane@example.com'),
        ];
        const result = buildHierarchyTree(flatUsers);
        expect(result).toHaveLength(2);
        const [user1, user2] = result;
        expect(user1?.reports).toEqual([]);
        expect(user2?.reports).toEqual([]);
    });

    it('should build a multi-level hierarchy correctly', () => {
        const result = buildHierarchyTree(mockUsers);
        
        // Check top level
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(1);
        
        // Check first level reports
        expect(result[0].reports).toHaveLength(2);
        expect((result[0].reports as HierarchyUser[]).map(r => r.id)).toEqual([2, 3]);
        
        // Check second level reports
        const jane = result[0].reports?.find(r => r.id === 2);
        expect(jane?.reports).toHaveLength(2);
        expect((jane?.reports as HierarchyUser[]).map(r => r.id)).toEqual([4, 5]);
    });   
});
