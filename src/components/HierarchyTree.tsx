import type { HierarchyUser } from "../types/user";
import HierarchyItem from "./HierarchyItem";

export default function HierarchyTree(hierarchyTree: HierarchyUser[]) {
    return (
        <div className="mt-10">
            {Object.values(hierarchyTree).map((item) => 
                <HierarchyItem {...item} key={item.id} />
            )}
        </div>
    );
}