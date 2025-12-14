import { useState, useCallback } from 'react';
import useAuth from './useAuth';

interface LoginFormValues {
  email: string;
  password: string;
}

export function useLoginForm() {
  const [formData, setFormData] = useState<LoginFormValues>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  }, [formData.email, formData.password, login]);

  return {
    formData,
    error,
    isLoading,
    handleChange,
    handleSubmit,
  };
}