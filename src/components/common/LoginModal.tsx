import React, { useState } from "react";
import { Modal } from "./Modal";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, LogOut } from "lucide-react";
import { useToast } from "./Toast";
import {
  CelebrationCharacter,
  CharacterState,
} from "../character/CelebrationCharacter";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../lib/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser, signUpWithEmail, signInWithEmail, signInWithGoogle, signOut } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [characterState, setCharacterState] = useState<CharacterState>("greeting");
  const [speechText, setSpeechText] = useState(
    "Welcome! I am Wishy, your celebration assistant 🎉"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleEmailFocus = () => {
    setFocusedField("email");
    setCharacterState("looking");
    setSpeechText("Enter your email address below! 📧");
  };

  const handlePasswordFocus = () => {
    setFocusedField("password");
    setCharacterState("coveringEyes");
    setSpeechText("I won't look at your password! 🙈");
  };

  const handleNameFocus = () => {
    setFocusedField("name");
    setCharacterState("happy");
    setSpeechText("What a nice name! Glad to meet you 😊");
  };

  const handleBlur = () => {
    setFocusedField(null);
    setCharacterState("idle");
    setSpeechText(
      isSignUp
        ? "Create an account to save your wishes ✨"
        : "Ready when you are! 👋"
    );
  };

  const toggleShowPassword = () => {
    const nextVal = !showPassword;
    setShowPassword(nextVal);
    if (nextVal) {
      setCharacterState("happy");
      setSpeechText("Peeking at the password! 👁️");
    } else {
      setCharacterState("coveringEyes");
      setSpeechText("Back to covering eyes! 🙈");
    }
  };

  const formatFirebaseError = (code: string): string => {
    switch (code) {
      case "auth/email-already-in-use": return "This email is already registered. Try signing in.";
      case "auth/wrong-password": return "Incorrect password. Please try again.";
      case "auth/user-not-found": return "No account found with this email.";
      case "auth/invalid-email": return "Please enter a valid email address.";
      case "auth/weak-password": return "Password must be at least 6 characters.";
      case "auth/popup-closed-by-user": return "Google sign-in was cancelled.";
      case "auth/invalid-credential": return "Invalid email or password.";
      default: return "Something went wrong. Please try again.";
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
      } else {
        // Check for admin credentials
        if (email === "raghabbarik@gmail.com" && password === "Raghab@2026") {
          // Simple admin token, in real app use proper auth
          localStorage.setItem("adminToken", "admin");
          navigate("/admin/dashboard");
          onClose();
          return;
        }
        await signInWithEmail(email, password);
      }

      setCharacterState("celebrating");
      setSpeechText(
        isSignUp
          ? "Account created! 🎉 Let's celebrate!"
          : "Login successful! 🎉 Welcome back!"
      );
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });

      showToast(
        isSignUp ? "Welcome to Wishy! 🎉" : "Signed in! 👋",
        isSignUp ? "Your account has been created." : `Welcome back, ${email}`
      );

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      const msg = formatFirebaseError(err.code);
      setError(msg);
      setCharacterState("confused");
      setSpeechText("Hmm, something went wrong! 😅");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const user = await signInWithGoogle();
      setCharacterState("celebrating");
      setSpeechText("Connected with Google! 🚀");
      confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
      showToast(
        "Signed in with Google! 🚀",
        `Welcome, ${user.displayName || user.email}!`
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      const msg = formatFirebaseError(err.code);
      setError(msg);
      setCharacterState("confused");
      setSpeechText("Google sign-in failed! 😅");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    showToast("Signed out", "See you next time! 👋");
    onClose();
  };

  const handleToggleMode = () => {
    const nextMode = !isSignUp;
    setIsSignUp(nextMode);
    setError(null);
    setCharacterState(nextMode ? "greeting" : "waving");
    setSpeechText(
      nextMode ? "Let's create a new account! 🌟" : "Welcome back friend! 👋"
    );
  };

  // If user is already logged in, show profile view
  if (currentUser) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Your Account"
        subtitle="You are signed in to Wishy"
        maxWidth="sm"
      >
        <div className="flex flex-col items-center gap-6 py-4">
          <CelebrationCharacter
            state="happy"
            speechText={`Hi, ${currentUser.displayName || currentUser.email}! 👋`}
            size="md"
          />
          <div className="text-center space-y-1">
            {currentUser.displayName && (
              <p className="text-base font-bold text-[#4e220f]">{currentUser.displayName}</p>
            )}
            <p className="text-xs text-[#4e220f]/70">{currentUser.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-[#b0ba99] text-[#4e220f] font-bold text-xs hover:bg-[#b0ba99]/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isSignUp ? "Create your Wishy Account" : "Welcome back to Wishy"}
      subtitle={
        isSignUp
          ? "Start crafting shareable digital surprises"
          : "Manage your generated celebration links"
      }
      maxWidth="lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Character Column */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-[#b0ba99]/40 rounded-2xl border border-[#b0ba99]">
          <CelebrationCharacter
            state={characterState}
            speechText={speechText}
            size="lg"
            interactive={true}
            onClick={() => {
              setCharacterState("happy");
              setSpeechText("Hi there! Ready to bring smiles? 😊");
            }}
          />
        </div>

        {/* Form Column */}
        <div className="md:col-span-7 space-y-4">
          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-2.5 rounded-xl">
              ⚠️ {error}
            </div>
          )}

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-[#b0ba99] bg-white/60 text-[#4e220f] font-semibold text-xs hover:bg-white/80 transition-all shadow-sm disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#b0ba99] w-full" />
            <span className="bg-[#f7f1de] px-3 text-[10px] text-[#4e220f] font-bold uppercase tracking-wider absolute">
              Or with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-xs font-semibold text-[#4e220f] mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#4e220f] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={handleNameFocus}
                      onBlur={handleBlur}
                      placeholder="Alex Morgan"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#b0ba99] bg-white/60 text-[#4e220f] text-xs focus:outline-none focus:ring-2 focus:ring-[#9d6638]/40"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-semibold text-[#4e220f] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#4e220f] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={handleEmailFocus}
                  onBlur={handleBlur}
                  placeholder="alex@example.com"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#b0ba99] bg-white/60 text-[#4e220f] text-xs focus:outline-none focus:ring-2 focus:ring-[#9d6638]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4e220f] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#4e220f] absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={handlePasswordFocus}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full pl-10 pr-10 py-2 rounded-xl border border-[#b0ba99] bg-white/60 text-[#4e220f] text-xs focus:outline-none focus:ring-2 focus:ring-[#9d6638]/40"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-2.5 text-[#4e220f]/60 hover:text-[#4e220f]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#9d6638] hover:bg-[#4e220f] text-[#f7f1de] font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Please wait...</span>
              ) : (
                <>
                  <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[#4e220f] pt-1">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              type="button"
              onClick={handleToggleMode}
              className="text-[#9d6638] font-semibold hover:underline ml-1"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
};
