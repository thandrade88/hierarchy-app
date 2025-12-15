import type { HierarchyUser, UserData } from "../types/user";

export const MOCK_USER_ITEM: HierarchyUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    email: 'john@example.com',
    photo: 'https://example.com/photo.jpg',
    initials: 'JD',
    isManager: true,
    reports: [
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        photo: 'https://example.com/jane.jpg',
        initials: 'JS',
        isManager: false,
        reports: []
      }
    ]
  };

  export const MOCK_LOGGED_USER: UserData = { 
    id: 1, 
    firstName: 'Anthony', 
    lastName: 'Xiouping', 
    email: 'test@user.com' 
};