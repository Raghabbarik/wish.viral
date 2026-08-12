import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<User>;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signUpWithEmail = async (email: string, password: string, name: string): Promise<User> => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const finalName = name.trim();
    if (finalName) {
      await updateProfile(result.user, { displayName: finalName });
    }
    await setDoc(doc(db, "users", result.user.uid), {
      id: result.user.uid,
      name: finalName || result.user.displayName || "User",
      email: result.user.email,
      plan: "free",
      status: "active",
      joinedAt: new Date().toISOString().split("T")[0],
      lastActive: new Date().toLocaleDateString(),
      celebrationsCount: 0,
      avatar: (finalName || result.user.displayName || "User").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
    }, { merge: true });
    return result.user;
  };

  const signInWithEmail = async (email: string, password: string): Promise<User> => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", result.user.uid), {
      id: result.user.uid,
      name: result.user.displayName || result.user.email?.split("@")[0] || "User",
      email: result.user.email,
      lastActive: new Date().toLocaleDateString(),
    }, { merge: true });
    return result.user;
  };

  const signInWithGoogle = async (): Promise<User> => {
    const result = await signInWithPopup(auth, googleProvider);
    const name = result.user.displayName || "Google User";
    await setDoc(doc(db, "users", result.user.uid), {
      id: result.user.uid,
      name: name,
      email: result.user.email,
      plan: "free",
      status: "active",
      joinedAt: new Date().toISOString().split("T")[0],
      lastActive: new Date().toLocaleDateString(),
      avatar: name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
    }, { merge: true });
    return result.user;
  };

  const signOut = () => firebaseSignOut(auth);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
