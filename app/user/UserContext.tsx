"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  // Add other fields as needed
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to get user profile from Firestore if available
    async function fetchUser() {
      try {
        const { auth, db } = await import("@/lib/firebaseClient");
        const { onAuthStateChanged } = await import("firebase/auth");
        const { doc, getDoc } = await import("firebase/firestore");
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            let loadedUser: User;
            if (userDoc.exists()) {
              const data = userDoc.data();
              loadedUser = {
                uid: firebaseUser.uid,
                name: data.name ?? firebaseUser.displayName ?? "",
                email: firebaseUser.email ?? "",
                phone: data.phone ?? firebaseUser.phoneNumber ?? ""
              };
            } else {
              loadedUser = {
                uid: firebaseUser.uid,
                name: firebaseUser.displayName ?? "",
                email: firebaseUser.email ?? "",
                phone: firebaseUser.phoneNumber ?? ""
              };
            }
            setUser(loadedUser);
          } else {
            setUser(null);
          }
          setIsLoading(false);
        });
      } catch (err) {
        setUser(null);
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
