'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, Wallet } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setIsLoading(false);
        } else {
            router.push('/admin');
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-blue-50">
                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-[#2563EB] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <Wallet size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Login</h1>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Management Portal</p>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@p2cgateway.com"
                                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 animate-shake">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={isLoading}
                        className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl transition duration-300 shadow-lg hover:bg-gray-800 disabled:opacity-70 flex items-center justify-center"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Log In to Dashboard'}
                    </button>
                </form>

                <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                    Secure encrypted session
                </p>
            </div>
        </div>
    );
}
