import { useMemo, useState, type KeyboardEvent } from "react";
import type { HierarchyUser } from "../../types/user";
import Avatar from "../Avatar/Avatar";

interface HierarchyItemProps extends Omit<HierarchyUser, 'reports'> {
  reports?: HierarchyUser[];
}

export default function HierarchyItem(user: HierarchyItemProps) {
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
        <div 
            className="ml-5 mb-5"             
            aria-expanded={hasReports ? isExpanded : undefined}
        >
            <div
                role="treeitem" 
                aria-label={user.fullName}
                aria-expanded={isExpanded} 
                aria-controls={`${user.id}-reports`}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onClick={toggleExpanded} 
                className={`outline-none rounded focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                    hasReports ? 'cursor-pointer' : 'cursor-default'
                }`}
            >
                <div className="flex items-center justify-start align-middle">
                    <span 
                        className="mr-5 text-4xl select-none text-center w-5"
                        aria-hidden="true"
                    >
                        {hasReports ? '+' : '-'}
                    </span>
                    <Avatar photoUrl={user.photo} initials={user.initials} />
                    <h4 className="ml-5 text-md">
                        <span>{user.fullName}</span>  <span className="ml-3">{user.email}</span>
                    </h4>
                </div>
            </div>
            {isExpanded && hasReports && (
                <ul 
                    className="ml-10 mt-5" 
                    id={`${user.id}-reports`} 
                    aria-labelledby={`${user.id}-label`}
                    role="group"
                > 
                    <li id={`${user.id}-label`} className="sr-only">
                        {user.fullName}'s reports
                    </li>
                    {reports.map((report) => (
                        <li key={report.id} role="treeitem">
                            <HierarchyItem {...report} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}