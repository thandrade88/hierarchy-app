import type { UserData } from "../types/user";

export default function buildHierarchyTree(users: UserData[]) {
   const managers =  Object.values(users).filter(user => user.managerId === undefined);   
   
    const team = managers.map((manager: UserData) => {
        return {
            manager: {...manager},            
            reports: Object.values(users).filter(user => user.managerId !== undefined && user.managerId === manager.id)
        };
    });


    console.log(team);       

    
    return team;
}