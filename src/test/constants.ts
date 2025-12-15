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

export const MOCK_SECRETS_DATA = {
  'valid_secret_123': 101,
  'another_secret': 102,
};


export const MOCK_USERS_DATA: UserData[] = [
    { id: 100, firstName: 'Root', lastName: 'Manager', email: 'root@test.com' },
    { id: 101, firstName: 'John', lastName: 'Doe', email: 'john@test.com', managerId: 100 },
    { id: 102, firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com', managerId: 100, photo: 'jane.jpg' },
];



export const MOCK_INVALID_USER_DATA = [
    ...MOCK_USERS_DATA,
    { id: 'invalid', firstName: 'Bad', lastName: 'Data', email: 'bad@test.com' }
];