import { useState } from "react";


const API_BASE_URL = "/api/v1";
const USE_MOCK = true; // Set to false and update API_BASE_URL to use real endpoint

async function loginUser({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const err = new Error(errorData.message || "Login failed");
    err.status = response.status;
    throw err;
  }
  return response.json();
}

async function mockLoginUser({ email, password }) {
  await new Promise((r) => setTimeout(r, 1400));
  if (email === "admin@digitalgurkha.com" && password === "password123") {
    return { token: "mock-jwt-token", user: { name: "Admin", email } };
  }
  const error = new Error("Invalid credentials");
  error.status = 401;
  throw error;
}

const callAuthAPI = USE_MOCK ? mockLoginUser : loginUser;

// ─── ICONS ────────────────────────────────────────────────────────────────────
const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-stone-300">
    <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1.5 5.5l6.5 4 6.5-4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

const EyeOpenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const EyeShutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2" />
    <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
    <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

// ─── VALIDATION ───────────────────────────────────────────────────────────────
function validateEmail(val) {
  if (!val.trim()) return "Email address is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()))
    return "Please enter a valid email address.";
  return "";
}

function validatePassword(val) {
  if (!val) return "Password is required.";
  if(val.length < 8) return "Password must be at least 8 characters.";
  return "";
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [credentialsError, setCredentialsError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailBlur = () => setEmailError(validateEmail(email));
  const handlePasswordBlur = () => setPasswordError(validatePassword(password));

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setCredentialsError("");
    if (emailError) setEmailError(validateEmail(e.target.value));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setCredentialsError("");
    if (passwordError) setPasswordError(validatePassword(e.target.value));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    setCredentialsError("");

    if (eErr || pErr) return;

    setIsLoading(true);
    try {
      const data = await callAuthAPI({ email: email.trim(), password });
      console.log("Login success:", data);
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        setCredentialsError("Incorrect email or password. Please try again.");
      } else if (err.status >= 500) {
        setCredentialsError("A server error occurred. Please try again later.");
      } else if (!err.status) {
        setCredentialsError("Unable to connect. Please check your internet connection.");
      } else {
        setCredentialsError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl px-10 py-8 shadow-sm">

        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 bg-stone-900 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-amber-400 font-serif text-lg font-semibold leading-none">DG</span>
          </div>
          <div className="w-px h-9 bg-stone-200" />
          <div>
            <p className="text-stone-900 font-semibold text-base leading-tight">Digital Gurkha</p>
            <p className="text-stone-400 text-xs uppercase tracking-widest">Learning Platform</p>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-stone-900 tracking-tight mb-1">Welcome back</h1>
        <p className="text-sm text-stone-400 mb-6">Sign in to continue to your dashboard</p>

        {/* Credentials error banner */}
        {credentialsError && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3.5 py-2.5 mb-5">
            <AlertIcon />
            <span>{credentialsError}</span>
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-stone-600 uppercase tracking-wider mb-1.5">
            Email address
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              onKeyDown={handleKeyDown}
              placeholder="you@example.com"
              autoComplete="email"
              className={`w-full h-11 bg-stone-50 border rounded-lg pl-3.5 pr-10 text-sm text-stone-900 placeholder-stone-300 outline-none transition
                focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20
                ${emailError ? "border-red-400 ring-2 ring-red-400/10" : "border-stone-200"}`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <EmailIcon />
            </span>
          </div>
          {emailError && (
            <p className="text-xs text-red-500 mt-1.5">{emailError}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-1">
          <label className="block text-xs font-medium text-stone-600 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              onKeyDown={handleKeyDown}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={`w-full h-11 bg-stone-50 border rounded-lg pl-3.5 pr-11 text-sm text-stone-900 placeholder-stone-300 outline-none transition
                focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20
                ${passwordError ? "border-red-400 ring-2 ring-red-400/10" : "border-stone-200"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition p-0.5"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeShutIcon /> : <EyeOpenIcon />}
            </button>
          </div>
          {passwordError && (
            <p className="text-xs text-red-500 mt-1.5">{passwordError}</p>
          )}
          <div className="flex justify-end mt-2">
            <button
              type="button"
              className="text-xs text-amber-600 hover:text-amber-700 hover:underline font-medium"
            >
              Forgot password?
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full h-11 mt-6 bg-stone-900 hover:bg-stone-800 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-stone-50 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition"
        >
          {isLoading ? (
            <>
              <Spinner />
              <span>Signing in…</span>
            </>
          ) : (
            <span>Sign in</span>
          )}
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-stone-400 border-t border-stone-100 mt-6 pt-5">
          Having trouble? Contact{" "}
          <span className="text-stone-600 font-medium">support@digitalgurkha.com</span>
        </p>
      </div>
    </div>
  );
}