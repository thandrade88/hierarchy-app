import { useContext } from "react";
import type { AuthContextType } from "../context/auth-context.types";
import { AuthContext } from "../context/auth-context.types";

export const useAuth = (): AuthContextType => {
    return useContext(AuthContext);
  };
  
  export default useAuth;