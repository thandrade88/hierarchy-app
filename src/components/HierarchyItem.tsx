import { useState } from "react";
import type { HierarchyUser } from "../types/user";
import Avatar from "./Avatar";

export default function HierarchyItem(props: HierarchyUser) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasReports = props.reports?.length > 0;
    
    return (
        <div className="ml-5">
            <div onClick={() => hasReports && setIsExpanded(!isExpanded)}>
                <div className="flex items-center justify-start align-middle mb-10">
                    <span className={`mr-5 text-4xl`}>{hasReports ? '+' : '-'}</span>
                    <Avatar photoUrl={props.photo} initials={props.initials} />
                    <span className="ml-5 text-xl">{props.fullName}</span>
                    <span className="ml-5 text-xl">{props.email}</span>
                </div>
            </div>
            {isExpanded && hasReports && (
                <ul className="ml-10">
                    {props.reports.map((report: HierarchyUser) => (
                        <HierarchyItem {...report} key={report.id}/>
                    ))}
                </ul>
            )}
        </div>
    );
}