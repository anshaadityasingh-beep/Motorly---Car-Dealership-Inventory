import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8 || !/\d/.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters and contain a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      await register(formData.name.trim(), formData.email.trim(), formData.password);
      navigate('/', { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Registration failed. Please try again.';
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Brand Hero Panel (Left side on desktop) */}
      <div className="md:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 text-white p-8 md:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-amber/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-glow-brand">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold font-display tracking-tight">ApexMotors</span>
          </div>

          <div className="mt-16 md:mt-24 max-w-md">
            <span className="inline-block px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full text-xs font-semibold tracking-wide uppercase mb-4 border border-brand-500/30">
              New Customer Account
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight leading-tight">
              Join the modern showroom.
            </h1>
            <p className="mt-4 text-slate-300 text-sm md:text-base leading-relaxed">
              Explore luxury sedans, electric performance, and rugged SUVs with instant stock confirmation.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-12 pt-8 border-t border-slate-800 text-xs text-slate-400">
          Secure, authenticated transactions with real-time stock allocation.
        </div>
      </div>

      {/* Form Panel (Right side on desktop) */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-20">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-display">
              Create an account
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Start reserving and purchasing vehicles today.
            </p>
          </div>

          {serverError && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3 animate-fadeIn"
            >
              <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="Full Name"
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. John Doe"
              value={formData.name}
              error={errors.name}
              onChange={handleChange}
            />

            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              error={errors.email}
              onChange={handleChange}
            />

            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              required
              placeholder="Min. 8 characters, incl. a number"
              helperText="Must be at least 8 characters and include at least 1 number."
              value={formData.password}
              error={errors.password}
              onChange={handleChange}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full mt-4"
            >
              Create Account
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-brand-600 hover:text-brand-700 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
