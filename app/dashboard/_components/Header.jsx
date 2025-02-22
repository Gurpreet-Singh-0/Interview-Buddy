'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu } from 'lucide-react';

function Header() {
    const path = usePathname();

    useEffect(() => {
        console.log(path);
    }, [path]);

    return (
        <div className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                
                <div className="flex items-center">
                 <Link href={'/'}>  <Image 
                        src="/logo.png" 
                        width={160} 
                        height={100} 
                        alt="logo"
                        className="h-14 w-auto cursor-pointer"
                    /> </Link> 
                </div>

                <nav className="hidden md:flex items-center space-x-8">
                    <Link 
                        href="/dashboard"
                        className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                            path === '/dashboard' 
                                ? 'text-blue-600 font-semibold' 
                                : 'text-slate-600'
                        }`}
                    >
                        Dashboard
                    </Link>
                    <Link 
                        href="/how-it-works"
                        className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                            path.startsWith('/dashboard/how') 
                                ? 'text-blue-600 font-semibold' 
                                : 'text-slate-600'
                        }`}
                    >
                        How it Works?
                    </Link>
                </nav>

               
                <button className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100">
                    <Menu className="h-6 w-6" />
                </button>

               
                <div className="flex items-center space-x-4">
                    <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "h-8 w-8"
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Header;