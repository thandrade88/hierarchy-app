import type { HierarchyUser } from "../../types/user";
import HierarchyItem from "../HierarchyItem/HierarchyItem";

export default function HierarchyTree({ users }: { users: HierarchyUser[] }) {
    
    return (
        <div className="mt-10">
            {users?.map((user) => 
                <HierarchyItem key={user.id} {...user} />
            )}
        </div>
    );
}