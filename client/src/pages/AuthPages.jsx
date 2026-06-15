import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Page from '../components/Page';
import api, { apiError } from '../utils/axios';
import { useAuth } from '../context/AuthContext';

function AuthShell({ eyebrow, title, copy, children, footer }) {
  return (
    <Page className="container-app flex min-h-[calc(100vh-145px)] items-center justify-center py-14">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-line lg:grid-cols-[1fr_1.1fr]">
        {/* Decorative side panel */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-fire/20 via-surface to-surface lg:block">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-10">
            <motion.span
              className="text-8xl"
              animate={{ rotate: [0, 5, -5, 0], y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🍕
            </motion.span>
            <p className="mt-6 text-center font-display text-2xl font-bold tracking-tight">
              Every pizza tells a story.
            </p>
            <p className="mt-2 text-center text-sm text-muted">Make yours unforgettable.</p>
          </div>
          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-fire/10 blur-3xl" />
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber/10 blur-3xl" />
        </div>

        {/* Form side */}
        <section className="bg-surface p-7 sm:p-9">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">{title}</h1>
          {copy && <p className="mt-3 text-sm leading-6 text-muted">{copy}</p>}
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-7 border-t border-line pt-5 text-center text-sm text-muted">{footer}</div>}
        </section>
      </div>
    </Page>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input className="input" {...props} />
    </label>
  );
}

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`);
      const fallback = user.role === 'admin' ? '/admin' : '/menu';
      navigate(location.state?.from?.pathname || fallback, { replace: true });
    } catch (error) {
      toast.error(apiError(error, 'Unable to log in'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Your table is waiting."
      footer={<>New here? <Link className="font-semibold text-fire hover:text-amber transition-colors" to="/register">Create an account</Link></>}
    >
      <form className="space-y-5" onSubmit={submit}>
        <Field label="Email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Field label="Password" type="password" autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <div className="text-right">
          <Link className="text-sm text-muted hover:text-amber transition-colors" to="/forgot-password">Forgot password?</Link>
        </div>
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Logging in...' : 'Log in'}</button>
      </form>
    </AuthShell>
  );
}

export function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const strength = (() => {
    const p = form.password;
    if (!p) return { level: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-danger' };
    if (score === 2) return { level: 2, label: 'Fair', color: 'bg-amber' };
    if (score === 3) return { level: 3, label: 'Good', color: 'bg-success/70' };
    return { level: 4, label: 'Strong', color: 'bg-success' };
  })();

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await api.post('/auth/register', form);
      const user = await login({ email: form.email, password: form.password });
      toast.success(`Welcome, ${user.name.split(' ')[0]}! 🍕`);
      navigate(user.role === 'admin' ? '/admin' : '/menu', { replace: true });
    } catch (error) {
      toast.error(apiError(error, 'Unable to create account'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Create account"
      title="Join the pizza side."
      copy="Use 8+ characters with an uppercase letter, number, and special character."
      footer={<>Already registered? <Link className="font-semibold text-fire hover:text-amber transition-colors" to="/login">Log in</Link></>}
    >
      <form className="space-y-5" onSubmit={submit}>
        <Field label="Name" autoComplete="name" minLength="2" maxLength="50" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Field label="Email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <div>
          <Field label="Password" type="password" autoComplete="new-password" minLength="8" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {form.password && (
            <div className="mt-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i <= strength.level ? strength.color : 'bg-line'
                    }`}
                  />
                ))}
              </div>
              <p className={`mt-1.5 text-xs font-medium ${
                strength.level <= 1 ? 'text-danger' : strength.level === 2 ? 'text-amber' : 'text-success'
              }`}>
                {strength.label}
              </p>
            </div>
          )}
        </div>
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Creating account...' : 'Create account'}</button>
      </form>
    </AuthShell>
  );
}

export function VerifyEmail() {
  const [params] = useSearchParams();
  const [state, setState] = useState({ busy: true, message: '' });
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    const token = params.get('token');
    if (!token) {
      setState({ busy: false, error: 'Verification token is missing.' });
      return;
    }
    api.post(`/auth/verify-email?token=${encodeURIComponent(token)}`, undefined, { _silent: true })
      .then(({ data }) => setState({ busy: false, message: data.message }))
      .catch((error) => setState({ busy: false, error: apiError(error, 'Unable to verify email') }));
  }, [params]);

  return (
    <AuthShell eyebrow="Email verification" title={state.busy ? 'Checking your link...' : state.error ? 'Link needs attention.' : 'You are verified.'}>
      <p className={`leading-7 ${state.error ? 'text-danger' : 'text-muted'}`}>
        {state.busy ? 'This only takes a moment.' : state.error || state.message}
      </p>
      {!state.busy && <Link className="btn-primary mt-7 w-full" to={state.error ? '/register' : '/login'}>{state.error ? 'Back to sign up' : 'Continue to login'}</Link>}
    </AuthShell>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      toast.success(data.message);
      setEmail('');
    } catch (error) {
      toast.error(apiError(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell eyebrow="Account recovery" title="Reset your password." copy="We will email a secure one-hour reset link if the account exists.">
      <form className="space-y-5" onSubmit={submit}>
        <Field label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Sending...' : 'Send reset link'}</button>
        <Link className="block text-center text-sm text-muted hover:text-cream transition-colors" to="/login">Back to login</Link>
      </form>
    </AuthShell>
  );
}

export function ResetPassword() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    const token = params.get('token');
    if (!token) return toast.error('Reset token is missing');
    setBusy(true);
    try {
      const { data } = await api.post(`/auth/reset-password?token=${encodeURIComponent(token)}`, {
        newPassword: password,
      });
      toast.success(data.message);
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error(apiError(error, 'Unable to reset password'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell eyebrow="Secure reset" title="Choose a new password." copy="It must differ from your current password and meet all password requirements.">
      <form className="space-y-5" onSubmit={submit}>
        <Field label="New password" type="password" autoComplete="new-password" minLength="8" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Updating...' : 'Update password'}</button>
      </form>
    </AuthShell>
  );
}
