"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { MainLayout } from "@/components/main-layout";
import { useI18n } from "@/lib/providers";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";

type AuthMode = 'signin' | 'signup';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const { } = useI18n();

  // Redirect if user is already authenticated and has a complete profile
  useEffect(() => {
    const checkAuthState = async () => {
      if (user) {
        // Check if user has a complete profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
        
        if (profile?.username) {
          // User is authenticated and has a complete profile
          router.push('/');
        }
        // If user exists but no profile, stay on auth page to complete signup
      }
    };
    
    checkAuthState();
  }, [user, router, supabase]);

  // Check if username is available
  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    if (!username || username.length < 3) return false;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username.toLowerCase())
      .single();
    
    // If there's an error and it's "PGRST116" (no rows found), username is available
    // If there's data, username is taken
    // If there's any other error, consider username unavailable for safety
    if (error) {
      return error.code === 'PGRST116'; // No rows found = available
    }
    
    return !data; // If data exists, username is taken
  };

  // Handle sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user && data.session) {
        // Wait a moment for the session to be established
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check if user has a profile with username
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, full_name')
          .eq('id', data.user.id)
          .single();

        if (profile?.username) {
          // Successful sign in with complete profile - redirect to homepage
          router.push('/');
        } else {
          // Profile doesn't exist or missing username - try to create it
          const userData = data.user.user_metadata;
          if (userData?.username) {
            // Try to create profile from auth metadata
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                username: userData.username,
                full_name: userData.full_name || '',
                phone: userData.phone || '',
              });
            
            if (!profileError) {
              router.push('/');
            } else {
              setError('Profile setup incomplete. Please contact support.');
              await supabase.auth.signOut();
            }
          } else {
            setError('Profile not found. Please contact support.');
            await supabase.auth.signOut();
          }
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // Validate username first
      if (username.length < 3) {
        throw new Error('Username must be at least 3 characters');
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        throw new Error('Username can only contain letters, numbers, and underscores');
      }

      const isAvailable = await checkUsernameAvailability(username);
      if (!isAvailable) {
        throw new Error('Username is already taken');
      }

      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            username: username.toLowerCase(),
          }
        }
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }
        if (error.message.includes('invalid') && error.message.includes('email')) {
          throw new Error('Please enter a valid email address.');
        }
        throw error;
      }

      if (data.user) {
        // Wait a moment for the user to be fully created
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Create profile with username
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username: username.toLowerCase(),
            full_name: fullName,
            phone: phone,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw here - user is created, profile can be created later
          console.log('User created but profile creation failed. Profile will be created on first login.');
        }

        // Check if user is immediately signed in (email confirmation disabled)
        // or if they need to confirm email first
        if (data.session) {
          // User is immediately signed in - redirect to homepage
          router.push('/');
        } else {
          // Email confirmation required
          setMessage(
            'Account created successfully! Please check your email to confirm your account, then sign in.'
          );
          // Switch to sign in mode after successful signup
          setTimeout(() => {
            setMode('signin');
            setMessage('');
          }, 3000);
        }
        
        // Clear form
        setEmail('');
        setPassword('');
        setUsername('');
        setFullName('');
        setPhone('');
      }
    } catch (error: unknown) {
      console.error('Signup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during signup';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">
              {mode === 'signin' ? 'Sign in to Obilli' : 'Create your account'}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {mode === 'signin' 
                ? 'Welcome back! Please sign in to continue.' 
                : 'Join our marketplace community today.'
              }
            </p>
          </div>

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-6">
            {mode === 'signup' && (
              <>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">
                    Username *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      id="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Choose a username"
                    />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    3+ characters, letters, numbers, and underscores only
                  </p>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="+237 XXX XXX XXX"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (mode === 'signup' && !username)}
              className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-primary hover:text-primary/80 font-medium"
            >
              {mode === 'signin' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>

          {mode === 'signin' && (
            <div className="text-center">
              <Link href="/auth/reset-password" className="text-sm text-muted-foreground hover:text-foreground">
                Forgot your password?
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
