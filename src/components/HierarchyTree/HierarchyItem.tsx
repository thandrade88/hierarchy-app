import { useMemo, useState, type KeyboardEvent } from "react";
import type { HierarchyUser } from "../../types/user";
import Avatar from "./../Avatar/Avatar";

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

    const reports = user.reports || [];

    return (
        <div className="ml-5 mb-5" role="treeitem" aria-expanded={hasReports ? isExpanded : undefined}>
            <div
                role="button"
                aria-label={user.fullName}
                aria-expanded={isExpanded} 
                aria-controls={`${user.id}-reports`}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onClick={toggleExpanded} 
                className={`outline-none rounded focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${hasReports ? 'cursor-pointer' : 'cursor-default'}`}
            >
                <div className="flex items-center justify-start align-middle">
                    <button  
                        tabIndex={-1}                       
                        className="mr-5 text-4xl select-none text-center w-5">
                        {hasReports ? '+' : '-'}
                    </button>
                    <Avatar photoUrl={user.photo} initials={user.initials} />
                    <h4 className="ml-5 text-md">{user.fullName} &nbsp; {user.email}</h4>
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