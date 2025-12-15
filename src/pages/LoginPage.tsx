import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm/LoginForm";


export default function LoginPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    console.log(user);

    return (
        <div className="container mt-8 sm:mx-auto sm:w-5xl px-10 py-5">
            <div className="border border-black flex flex-col justify-center py-12 sm:px-6 lg:px-12">
                <div className="sm:mx-auto sm:w-full">
                    <h2 className="mt-6 text-3xl font-light">
                        Please login
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md border-1 border-black p-8">
                    <LoginForm />
                </div>
            </div>
        </div>
    );

}