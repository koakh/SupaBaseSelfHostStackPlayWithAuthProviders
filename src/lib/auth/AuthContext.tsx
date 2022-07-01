import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { createContext, FunctionComponent, useEffect, useState } from 'react';
import { ROUTE_AUTH, ROUTE_HOME } from '~/config';
// dependency for signIn, signUp
import { useMessage } from '~/lib/message';
// dependency for signIn, signUp
import { supabase } from '~/lib/supabase';
// dependency for signIn, signUp - we'll define it shortly in a separate file
import { SupabaseAuthPayload } from './auth.types';

// - signUp so that we can sign-up from anywhere in the app
// - signIn so that we can sign in from anywhere in the app
//   Today homepage / is using these methods, tomorrow dedicated /sign-up or /sign-in pages might
//   use it. It could be even consumed in a pop-up to prevent unnecessary transitions and clicks.
//   Additionally, we'll also pass a loading state so that consumers can show a progress indicator
//   while the sin up or sign-in process is in-flight.

// AuthContextProps defines the contract for what could be shared.
export type AuthContextProps = {
  user: User;
  signUp: (payload: SupabaseAuthPayload) => void;
  signIn: (payload: SupabaseAuthPayload) => void;
  signOut: () => void;
  loggedIn: boolean;
  loading: boolean;
  userLoading: boolean;
};

// Partial tells that it would be possible to initialize the context with an empty {},
// even when AuthContextProps needs some mandatory values.
export const AuthContext = createContext<Partial<AuthContextProps>>({});

export const AuthProvider: FunctionComponent = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const { handleMessage } = useMessage();

  useEffect(() => {
    const user = supabase.auth.user();

    setUserLoading(false);
    if (user) {
      setUser(user);
      setLoggedIn(true);
      router.push(ROUTE_HOME);
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const innerUser = session?.user! ?? null;
        setUserLoading(false);
        if (innerUser) {
          setUser(innerUser);
          setLoggedIn(true);
          // Your users will automatically be redirected to the `/profile` page on logging in
          router.push(ROUTE_HOME);
        } else {
          // nullify the user object
          setUser(null);
          // redirect to the home page
          router.push(ROUTE_AUTH);
        }
      }
    );

    return () => {
      // We'll simply unsubscribe from listening to the events when the user navigates away from our App.
      authListener.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signUp = async (payload: SupabaseAuthPayload) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp(payload);
      if (error) {
        handleMessage({ message: error.message, type: 'error' });
      } else {
        handleMessage({
          message:
            'Signup successful. Please check your inbox for a confirmation email!',
          type: 'success',
        });
      }
    } catch (error) {
      handleMessage({
        message: error.error_description || error,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (payload: SupabaseAuthPayload) => {
    try {
      setLoading(true);
      const { error, user } = await supabase.auth.signIn(payload);
      if (error) {
        handleMessage({ message: error.message, type: 'error' });
      } else {
        // handleMessage({
        //   message: "Log in successful. I'll redirect you once I'm done",
        //   type: 'success',
        // });
        handleMessage({ message: `Welcome, ${user.email}`, type: 'success' });
      }
    } catch (error) {
      handleMessage({
        message: error.error_description || error,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => supabase.auth.signOut();

  return (
    <AuthContext.Provider
      value={{
        user,
        signUp,
        signIn,
        signOut,
        loggedIn,
        loading,
        userLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
