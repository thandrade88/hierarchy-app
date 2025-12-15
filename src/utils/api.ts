import type { UserData, HierarchyUser } from '../types/user';

const FIREBASE_ROOT = 'https://gongfetest.firebaseio.com';
const secretsUrl = `${FIREBASE_ROOT}/secrets.json`;
const allUsersUrl = `${FIREBASE_ROOT}/users.json`;

/**
 * Transforms raw user data into the format expected by the application
 */
function transformUserData(users: UserData[]): HierarchyUser[] {
    if (!Array.isArray(users)) {
        throw new Error('Expected an array of users');
    }
    return users.map(user => {        
        if (typeof user.id !== 'number' || 
            typeof user.firstName !== 'string' || 
            typeof user.lastName !== 'string' || 
            typeof user.email !== 'string') {
            console.warn('Invalid user data:', user);
            throw new Error('Invalid user data structure');
        }
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            photo: user.photo,
            managerId: user.managerId,            
            fullName: `${user.firstName} ${user.lastName}`,
            initials: `${user.firstName[0]}${user.lastName[0]}`.toUpperCase(),
            isManager: !user.managerId
        };
    });
}

/**
 * Fetches the user data for a given secret from the API.
 *
 * @param {string} secret - The secret used to identify the user.
 * @return {Promise<UserData | null>} The user data if found, null otherwise.
 */
export async function getUserBySecret(secret: string): Promise<UserData | null> {
    
    try {
        const secretsData = await fetch(secretsUrl);

        if (!secretsData.ok) {
            throw new Error('Network response was not ok');
        }

        const secretsDataArray = await secretsData.json();
        const userId = secretsDataArray[secret];

        if (userId) {
            const usersData = await fetch(allUsersUrl);

            if (!usersData.ok) {
                throw new Error('Network response was not ok');
            }


            const usersDataArray = await usersData.json();
            const user = usersDataArray.find((user: UserData) => user.id === userId);

            return { 
                id: user.id, 
                firstName: user.firstName, 
                lastName: user.lastName, 
                email: user.email, 
                managerId: user.managerId 
            };
        }

        return null;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}


/**
 * Fetches all users from the API and sanitizes the data.
 *
 * @returns {Promise<UserData[]>} An array of UserData objects representing all users.
 * @throws {Error} If the API call fails or if the data cannot be retrieved.
 */
export async function fetchAllUsers(): Promise<UserData[]> {
    try {
        const response = await fetch(allUsersUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch users data');
        }

        const usersData = await response.json();

        return transformUserData(usersData);

    } catch (error) {
        console.error('Error fetching all users:', error);
        throw new Error(`Could not retrieve user hierarchy data: ${error instanceof Error ? error.message : String(error)}`);
    }
}