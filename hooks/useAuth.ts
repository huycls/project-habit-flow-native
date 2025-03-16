import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Platform } from 'react-native';

interface AuthState {
  user: any | null;
  session: any | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  session: null,

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    set({ user: data.user, session: data.session });
  },

  signUp: async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) throw error;

    set({ user: data.user, session: data.session });

    // Create profile after successful signup
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            full_name: name,
            avatar_url: null,
            updated_at: new Date().toISOString(),
          },
        ]);

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    set({ user: null, session: null });
  },

  signInWithGoogle: async () => {
    if (Platform.OS === 'web') {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
            skipBrowserRedirect: true,
          },
        });

        if (error) throw error;

        // Get the URL to redirect to
        const { data: { url } } = data;
        if (!url) throw new Error('No OAuth URL returned');

        // Redirect to the OAuth provider
        window.location.href = url;
      } catch (error) {
        console.error('Google sign in error:', error);
        throw error;
      }
    } else {
      throw new Error('Google authentication is only supported on web platform');
    }
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },
}));

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // Create or update user profile when signed in with OAuth
    const user = session?.user;
    if (user?.app_metadata.provider === 'google') {
      supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: user.user_metadata.full_name,
          avatar_url: user.user_metadata.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) console.error('Error updating profile:', error);
        });
    }
  }
});