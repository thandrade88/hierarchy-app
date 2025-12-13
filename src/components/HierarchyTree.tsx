import type { UserData } from "../types/user";
import Avatar from "./Avatar";


const userRow = function (userData: UserData) {
    return (
        <div key={userData.id} className="flex items-center justify-start align-middle mb-10">
            <span className={`mr-5 text-4xl`}>{userData.managerId ? '-' : '+'}</span>
            <Avatar photoUrl={userData.photo} initials={userData.firstName[0] + userData.lastName[0]} />
            <span className="ml-5 text-xl">{userData.firstName} {userData.lastName}</span>
            <span className="ml-5 text-xl">{userData.email}</span>
        </div>
    );
}

export default function HierarchyTree(hierarchyTree: { manager: UserData; reports: UserData[] }[]) {  

    return (
        <div className="mt-10">            
            {Object.values(hierarchyTree).map((item, index) => {
                return (
                    <div key={index} className="ml-5">
                    {userRow(item.manager)}

                        <ul className="ml-10">
                            {item.reports.map((report: UserData) => (
                                <li key={report.id}>
                                    {userRow(report)}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}