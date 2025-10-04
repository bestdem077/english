
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Cookies from 'js-cookie';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";


// Define the shape of the context data
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// Header for mobile view
function MobileHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="flex h-14 items-center border-b bg-background px-4 md:hidden">
       <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </SheetContent>
      </Sheet>
      <div className="flex-grow text-center">
            <h1 className="text-lg font-bold text-primary">LinguaLeap</h1>
      </div>
      <div className="w-10"></div> {/* Invisible placeholder to balance the title */}
    </header>
  );
}


// Layout for authenticated users
function AppLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Static sidebar for medium screens and up */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

// This component handles the rendering logic based on auth state
function AuthHandler({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isHomePage = pathname === '/';

    // If not logged in, redirect to login page from any protected route
    if (!user && !isAuthPage) {
      router.push('/login');
    }

    // If logged in, redirect from auth pages or home page to dashboard
    if (user && (isAuthPage || isHomePage)) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage) {
    // If on an auth page (and not logged in), just show the children
    return <>{children}</>;
  }
  
  if (user) {
    // If logged in and not on an auth page, show the layout
    return <AppLayout>{children}</AppLayout>;
  }

  // If not logged in and not on an auth page, router will redirect, show loading
  return (
     <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
  );
}


// Create the AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // When auth state changes, update the session cookie
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken(true);
          // Set the session cookie for server-side consumption
          Cookies.set('__session', token, { expires: 1, path: '/' });
        } catch (error) {
          console.error('Error setting session cookie:', error);
          Cookies.remove('__session');
        }
      } else {
        // If user logs out, remove the cookie
        Cookies.remove('__session');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
        <AuthHandler>{children}</AuthHandler>
    </AuthContext.Provider>
  );
}

// Create a custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}
