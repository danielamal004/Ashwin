import React from 'react';
import { NavLink } from 'react-router-dom';
import { Eye, Home, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

const Sidebar = () => {
    const navItems = [
        { name: 'Home', icon: Home, path: '/' },
        { name: 'Live Eye Scan', icon: Eye, path: '/scan' },
    ];

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl transition-transform">
            <div className="flex h-full flex-col px-3 py-4">
                <div className="mb-10 flex items-center pl-2.5">
                    <Activity className="mr-3 h-8 w-8 text-blue-500" />
                    <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
                        Visionary AI
                    </span>
                </div>
                <ul className="space-y-2 font-medium">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    cn(
                                        "group flex items-center rounded-lg p-3 text-slate-300 transition-all hover:bg-slate-800 hover:text-white",
                                        isActive && "bg-slate-800 text-white shadow-lg shadow-blue-500/10"
                                    )
                                }
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0 transition duration-75 group-hover:text-white" />
                                <span className="ml-3">{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <div className="mt-auto px-4 py-4">
                    <div className="rounded-xl bg-gradient-to-br from-blue-900/50 to-indigo-900/50 p-4 border border-blue-500/20">
                        <h5 className="mb-1 text-sm font-semibold text-blue-200">System Status</h5>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs text-emerald-400">Online & Ready</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
