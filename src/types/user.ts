export interface UserData {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    photo?: string;
    managerId?: number;
}

export interface HierarchyUser extends UserData {
  fullName: string;
  initials: string;
  isManager: boolean;  
  reports?: HierarchyUser[]; 
}