import type { UserData } from '../types/user';

const FIREBASE_ROOT = 'https://gongfetest.firebaseio.com';

export async function getUserBySecret(secret: string): Promise<UserData | null> {
    const secretsUrl = `${FIREBASE_ROOT}/secrets.json`;
    const allUsersUrl = `${FIREBASE_ROOT}/users.json`;

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
            const user = usersDataArray.filter((user: UserData) => user.id === userId)[0];

            return { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, managerId: user.managerId };
        }

        return null;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

export async function fetchAllUsers(): Promise<UserData[]> {
    console.log('server', FIREBASE_ROOT);
    const usersUrl = `${FIREBASE_ROOT}/users.json`;
    try {
        const response = await fetch(usersUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch users data');
        }

        const allUsersArray = await response.json();

        console.log('allUsersArray', allUsersArray);

        const usersArraySanitised: UserData[] = allUsersArray.map((user: UserData) => {
            // No need to copy every field if you can rely on the spread operator,
            // but if you must, here is the corrected logic:
            return {
                // Corrected: Assign user.photo directly, which keeps it as string or undefined
                photo: user.photo,
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                managerId: user.managerId,
                // NOTE: You are missing the 'secret' and 'password' fields here, which is 
                // a good thing for security if they are not needed on the front end!
            };
        });

        return usersArraySanitised;

    } catch (error) {
        console.error('Error fetching all users:', error);
        throw new Error('Could not retrieve user hierarchy data.');
    }
}