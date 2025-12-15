import { useLoginForm } from '../../hooks/useLoginForm';

export default function LoginForm() {
  const {
    formData,
    error,
    isLoading,
    handleChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div 
          role="alert" 
          className="text-red-600 text-sm mb-2"
        >
          {error}
        </div>
      )}

      <div className="flex items-center space-x-2">
        <div className="w-40">
          <label htmlFor="email" className="text-lg">Email:</label>
        </div>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="px-2 py-1 border rounded w-full"
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center space-x-2">
        <div className="w-40">
          <label htmlFor="password" className="text-lg">Password:</label>
        </div>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="px-2 py-1 border rounded w-full"
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </form>
  );
}