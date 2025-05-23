import { ReactNode, createContext, useState } from 'react';
import { Auth, removeAuth, saveAuth } from '../lib/data';

const authKey = 'um.auth';

export type User = {
  userId: number;
  userName: string;
};

export type UserContextValues = {
  user: User | undefined;
  token: string | undefined;
  handleSignIn: (user: User, token: string) => void;
  handleSignOut: () => void;
};
export const UserContext = createContext<UserContextValues>({
  user: undefined,
  token: undefined,
  handleSignIn: () => undefined,
  handleSignOut: () => undefined,
});

type Props = {
  children: ReactNode;
};
export function UserProvider({ children }: Props) {
  const storedAuth = localStorage.getItem(authKey);
  const initialAuth = storedAuth ? (JSON.parse(storedAuth) as Auth) : null;

  const [user, setUser] = useState<User | undefined>(initialAuth?.user);
  const [token, setToken] = useState<string | undefined>(initialAuth?.token);

  function handleSignIn(user: User, token: string) {
    setUser(user);
    setToken(token);
    saveAuth(user, token);
  }

  function handleSignOut() {
    setUser(undefined);
    setToken(undefined);
    removeAuth();
  }

  const contextValue = { user, token, handleSignIn, handleSignOut };
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
