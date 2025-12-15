import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getUserBySecret, fetchAllUsers } from '../utils/api';
import { MOCK_SECRETS_DATA, MOCK_USERS_DATA, MOCK_INVALID_USER_DATA } from '../test/constants';

const fetchMock = vi.fn();
// @ts-ignore - We're intentionally adding fetch to global for testing
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
(global as any).fetch = fetchMock;

const mockResponse = (data: any, ok: boolean = true) => ({
    ok: ok,
    json: async () => data,
    text: async () => JSON.stringify(data),
} as Response);

beforeEach(() => {
    fetchMock.mockClear();
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('API Utilities', () => {

    describe('getUserBySecret', () => {

        it('should return UserData for a valid secret', async () => {

            fetchMock.mockResolvedValueOnce(mockResponse(MOCK_SECRETS_DATA));
            fetchMock.mockResolvedValueOnce(mockResponse(MOCK_USERS_DATA));

            const user = await getUserBySecret('valid_secret_123');

            expect(user).toEqual({
                id: 101,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@test.com',
                managerId: 100
            });
        });

        it('should return null if the secret is not found', async () => {
            fetchMock.mockResolvedValueOnce(mockResponse(MOCK_SECRETS_DATA));
            const user = await getUserBySecret('unknown_secret');
            expect(user).toBeNull();
        });

        it('should return null on secrets network failure', async () => {
            fetchMock.mockResolvedValueOnce(mockResponse({}, false));
            const user = await getUserBySecret('valid_secret_123');
            expect(user).toBeNull();
        });

        it('should return null on users network failure after finding secret', async () => {
            fetchMock.mockResolvedValueOnce(mockResponse(MOCK_SECRETS_DATA));
            fetchMock.mockResolvedValueOnce(mockResponse({}, false));
            const user = await getUserBySecret('valid_secret_123');
            expect(user).toBeNull();
        });
    });

    describe('fetchAllUsers', () => {

        it('should fetch and transform all users successfully', async () => {
            fetchMock.mockResolvedValueOnce(mockResponse(MOCK_USERS_DATA));

            const result = await fetchAllUsers();

            expect(result).toEqual([
                {
                    ...MOCK_USERS_DATA[0],
                    fullName: 'Root Manager',
                    initials: 'RM',
                    isManager: true,
                    photo: undefined,
                },
                {
                    ...MOCK_USERS_DATA[1],
                    fullName: 'John Doe',
                    initials: 'JD',
                    isManager: false,
                    photo: undefined,
                },
                {
                    ...MOCK_USERS_DATA[2],
                    fullName: 'Jane Smith',
                    initials: 'JS',
                    isManager: false,
                    photo: 'jane.jpg',
                }


            ]);
        });

        it('should throw an error on network failure', async () => {
            fetchMock.mockResolvedValueOnce(mockResponse({}, false));
            await expect(fetchAllUsers()).rejects.toThrow('Could not retrieve user hierarchy data: Failed to fetch users data');
        });

        it('should throw an error if API returns invalid user structure', async () => {
            fetchMock.mockResolvedValueOnce(mockResponse(MOCK_INVALID_USER_DATA));
            await expect(fetchAllUsers()).rejects.toThrow('Could not retrieve user hierarchy data: Invalid user data structure');

        });
    });
});