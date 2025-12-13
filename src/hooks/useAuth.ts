import { useContext } from "react";
import type { AuthContextType } from "../context/AuthContext";
import { AuthContext } from "../context/AuthContext";

export const useAuth = (): AuthContextType => {
    return useContext(AuthContext);
  };
  
  export default useAuth;