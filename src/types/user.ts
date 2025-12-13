export interface UserData {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    photo?: string;
    managerId?: number;
    secret?:string;
}

// Interface for the structured data used in the Hierarchy Tree component
export interface HierarchyUser extends UserData {
  fullName: string;
  reports: HierarchyUser[]; // This allows for recursive component rendering
  isManager: boolean;// Calculated property to determine '+' or '-' sign [cite: 76, 77]
  isExpanded: boolean; // State for toggling visibility
}