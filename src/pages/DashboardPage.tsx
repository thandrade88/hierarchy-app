import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import type { HierarchyUser, UserData } from "../types/user";
import { fetchAllUsers } from "../utils/api";
import buildHierarchyTree from "../utils/hierarchy.ts";
import HierarchyTree from "../components/HierarchyTree";

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [hierarchyTree, setHierarchyTree] = useState<HierarchyUser[]>([]);
    const { user, logout } = useAuth();

    const showUsers = async () => {
        setIsLoading(true);
        const allUsers: UserData[] = await fetchAllUsers();
        const usersTree = buildHierarchyTree(allUsers);
        setHierarchyTree(usersTree as HierarchyUser[]);
        setIsLoading(false);
    };

    useEffect(() => {
        showUsers();
    }, []);

    console.log('hierarchyTree', hierarchyTree);

    return (
        <div className="container mt-8 mb-8 sm:mx-auto sm:w-5xl border border-black px-10 py-5">
            {isLoading && <p>Loading...</p>}
            {!isLoading &&
                <>
                    <div className="flex justify-end">
                        <p className="text-lg mr-2">{user?.firstName} {user?.lastName}</p>
                        (<a href="#" className="text-blue-500 underline" onClick={() => { logout(); }}>Logout</a>)
                    </div>
                    <div className="mt-10">
                        <h1 className="text-4xl font-light">Hierarchy Tree</h1>
                        <HierarchyTree users={hierarchyTree} />
                    </div>
                </>
            }
        </div>
    )
}