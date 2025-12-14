import { useEffect, useState, useMemo } from "react";
import type { HierarchyUser } from "../types/user";
import { fetchAllUsers } from "../utils/api";
import buildHierarchyTree from "../utils/hierarchy";
import HierarchyTree from "../components/HierarchyTree";
import { useAuth } from "../hooks/useAuth";

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<HierarchyUser[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const { user, logout } = useAuth();

    const hierarchyTree = useMemo(() => {
        return buildHierarchyTree(users);
    }, [users]);

    const loadUsers = async () => {
        let isRequestActive = true; 

        try {
            setIsLoading(true);
            setError(null);
            const allUsers = await fetchAllUsers();
    
            if (isRequestActive) {
                setUsers(allUsers as HierarchyUser[]);
            }
        } catch (err) {
            if (isRequestActive) {
                setError(err instanceof Error ? err : new Error('Failed to load users'));
            }
        } finally {
            if (isRequestActive) {
                setIsLoading(false);
            }
        }
    
        return () => {
            isRequestActive = false;
        };
    };
    
    useEffect(() => {
        let isMounted = true;
        let cleanup: (() => void) | undefined;

        if (user) {            
            const load = async () => {
                cleanup = await loadUsers();
            };
            load();
        }

        return () => {
            isMounted = false;
            if (cleanup) cleanup();
        };
    }, [user]);


    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
    };


    if (error) {
        return (
            <div className="container mt-8 mb-8 sm:mx-auto sm:w-5xl border border-black px-10 py-5">
                <div className="text-red-600">
                    Error: {error.message}
                    <button
                        onClick={() => window.location.reload()}
                        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Reload
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-8 mb-8 sm:mx-auto sm:w-5xl border border-black px-10 py-5">
            {isLoading ? (
                <div>Loading organization chart...</div>
            ) : (
                <>
                    <div className="flex justify-end">
                        <p className="text-lg mr-2">{user?.firstName} {user?.lastName}</p>
                        <a
                            href="#"
                            className="text-blue-500 underline"
                            onClick={handleLogout}
                        >
                            Logout
                        </a>
                    </div>
                    <div className="mt-10">
                        <h1 className="text-4xl font-light">Hierarchy Tree</h1>
                        <HierarchyTree users={hierarchyTree} />
                    </div>
                </>
            )}
        </div>
    );
}