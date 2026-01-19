import type { HierarchyUser } from "../../types/user";
import HierarchyItem from "../HierarchyItem/HierarchyItem";

export default function HierarchyTree({ users, deleteUser }: { users: HierarchyUser[], deleteUser: (userId: number) => void }) {
    
    return (
        <div className="mt-10">
            {users?.map((user) => 
                <HierarchyItem key={user.id + '-' + (user.managerId || 'no-manager')} {...user} deleteHandler={deleteUser} />
            )}
        </div>
    );
}