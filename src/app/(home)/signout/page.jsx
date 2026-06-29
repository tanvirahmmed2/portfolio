"use client";
import { useEffect } from 'react';
import { useAuth } from '@/components/helper/ContextProvider.jsx';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/helper/ToastProvider.jsx';

export default function SignoutPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    async function performSignout() {
      try {
        await logout();
        showToast("Logged out successfully", "success");
      } catch (err) {
        console.error('Error during signout:', err);
      } finally {
        router.push('/signin');
      }
    }
    performSignout();
  }, [logout, router, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 border-4 border-violet-500/15 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-violet-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-sm font-semibold tracking-wide">Signing you out...</p>
      </div>
    </div>
  );
}
