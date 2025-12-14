import { useMemo, useState, type KeyboardEvent } from "react";
import type { HierarchyUser } from "../types/user";
import Avatar from "./Avatar";

export default function HierarchyItem(user: HierarchyUser) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasReports = (user.reports?.length ?? 0) > 0;
    const toggleExpanded = () => setIsExpanded(!isExpanded);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleExpanded();
        }
    };

    const reports = useMemo(() => user.reports || [], [user.reports]);

    return (
        <div className="ml-5 mb-10" role="treeitem" aria-expanded={hasReports ? isExpanded : undefined}>
            <div 
                onClick={toggleExpanded} 
                role="button" 
                aria-expanded={isExpanded} 
                aria-controls={`${user.id}-reports`}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                className="outline-none rounded p-1 -m-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
                <div className="flex items-center justify-start align-middle">
                    <span className="mr-5 text-4xl cursor-pointer select-none" aria-hidden="true">
                        {hasReports ? '+' : '-'}
                    </span>
                    <Avatar photoUrl={user.photo} initials={user.initials} />
                    <span className="ml-5 text-xl">{user.fullName}</span>
                    <span className="ml-5 text-xl text-gray-600">{user.email}</span>
                </div>
            </div>
            {isExpanded && hasReports && (
                <ul 
                    className="ml-10" 
                    id={`${user.id}-reports`} 
                    aria-labelledby={`${user.id}-label`}
                    role="group"
                > 
                    <li id={`${user.id}-label`} className="sr-only">
                        {user.fullName}'s reports
                    </li>
                    {reports.map((report: HierarchyUser) => (
                        <li key={report.id} role="none">
                            <HierarchyItem {...report} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}