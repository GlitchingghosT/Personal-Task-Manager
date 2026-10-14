import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Eye, EyeOff, ListTodo, LockKeyhole, Mail } from 'lucide-react';
import { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { login, register } from '../services/api';

type AuthMode = 'login' | 'signup';

interface AuthPageProps {
  mode: AuthMode;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const responseData: unknown = error.response?.data;
    if (typeof responseData === 'object' && responseData !== null && 'message' in responseData &&
        typeof responseData.message === 'string') {
      return responseData.message;
    }
    if (!error.response) {
      return 'Could not connect to the server. Check that the API is running and try again.';
    }
  }
  return 'Something went wrong. Please try again.';
};

const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const isSignup = mode === 'signup';
  const navigate = useNavigate();
  const { token, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (token) {
    return <Navigate to="/tasks" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (isSignup && password !== confirmPassword) {
      setErrorMessage('Your passwords do not match.');
      return;
    }
    if (isSignup && password.length < 8) {
      setErrorMessage('Use at least 8 characters for your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = isSignup
        ? await register(email.trim(), password)
        : await login(email.trim(), password);
      signIn(result.token, result.email);
      navigate('/tasks', { replace: true });
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f4fa] p-4 sm:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(70,38,99,0.12)] lg:grid-cols-[1fr_1fr]">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#7136a7] via-[#8848bd] to-[#a66ad2] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border border-white/15" />
          <div className="pointer-events-none absolute -bottom-36 -left-24 h-96 w-96 rounded-full border border-white/15" />
          <div className="relative">
            <Link to="/" className="inline-flex items-center gap-3 text-xl font-bold tracking-tight">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15">
                <ListTodo size={23} />
              </span>
              TaskDuty
            </Link>
          </div>

          <div className="relative max-w-md">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-purple-100">
              Make room for what matters
            </p>
            <h1 className="text-4xl font-semibold leading-tight xl:text-5xl">
              A little focus goes a long way.
            </h1>
            <p className="mt-5 text-base leading-7 text-purple-100">
              Keep your tasks in one calm place. Plan the next step, stay on track, and celebrate the progress.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm text-purple-50">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15">
                <Check size={15} />
              </span>
              Your personal tasks, organized your way
            </div>
          </div>

          <p className="relative text-xs text-purple-100/80">Small steps. Steady progress.</p>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-12 lg:px-14">
          <div className="w-full max-w-md">
            <Link to="/" className="mb-10 inline-flex items-center gap-2 font-bold text-[#793fa7] lg:hidden">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f1e7f8]">
                <ListTodo size={19} />
              </span>
              TaskDuty
            </Link>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold text-[#974FD0]">
                {isSignup ? 'GET STARTED' : 'WELCOME BACK'}
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
                {isSignup ? 'Create your account' : 'Sign in to TaskDuty'}
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {isSignup
                  ? 'A more organized day starts with one small step.'
                  : 'Pick up where you left off and keep your day moving.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail aria-hidden="true" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#974FD0] focus:ring-4 focus:ring-[#974FD0]/10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole aria-hidden="true" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type={passwordVisible ? 'text' : 'password'}
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    required
                    minLength={isSignup ? 8 : undefined}
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    placeholder={isSignup ? 'At least 8 characters' : 'Enter your password'}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#974FD0] focus:ring-4 focus:ring-[#974FD0]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(visible => !visible)}
                    aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#974FD0]/30"
                  >
                    {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {isSignup && (
                <div>
                  <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-gray-700">
                    Confirm password
                  </label>
                  <div className="relative">
                    <LockKeyhole aria-hidden="true" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="confirm-password"
                      type={passwordVisible ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={event => setConfirmPassword(event.target.value)}
                      placeholder="Enter your password again"
                      className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#974FD0] focus:ring-4 focus:ring-[#974FD0]/10"
                    />
                  </div>
                </div>
              )}

              {errorMessage && (
                <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#974FD0] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#974FD0]/20 transition hover:bg-[#833bbd] focus:outline-none focus:ring-4 focus:ring-[#974FD0]/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? (isSignup ? 'Creating account...' : 'Signing in...')
                  : (isSignup ? 'Create account' : 'Sign in')}
                {!isSubmitting && <ArrowRight size={17} />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-500">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Link
                to={isSignup ? '/login' : '/signup'}
                className="font-semibold text-[#8848bd] hover:text-[#7136a7] hover:underline"
              >
                {isSignup ? 'Sign in' : 'Sign up'}
              </Link>
            </p>
            <p className="mt-8 text-center text-xs text-gray-400">
              By continuing, you agree to keep your account details secure.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthPage;
