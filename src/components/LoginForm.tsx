import { useState } from "react";
import useAuth from "../hooks/useAuth";

export default function LoginForm() {
    const [email, setEmail] = useState('anthony.xiouping@xtreet.tvl');
    const [password, setPassword] = useState('mllv9n0x');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-row justify-between">
                <label htmlFor="email" className="text-gray-700">Email address:</label>
                <input type="email" id="email" value={email} onChange={(event) => setEmail(event.target.value)} className="border border-gray-300 rounded px-3 py-2" />
            </div>

            <div className="flex flex-row justify-between">
                <label htmlFor="password" className="text-gray-700">Password:</label>
                <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} className="border border-gray-300 rounded px-3 py-2" />
            </div>

            <button type="submit" disabled={isLoading} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </form>
    );
}