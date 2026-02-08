import React from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
            <Sidebar />
            <MobileNav />
            <div className="p-4 sm:ml-64 relative z-10 pb-20 md:pb-4">
                <main className="mx-auto max-w-7xl px-4 pt-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
