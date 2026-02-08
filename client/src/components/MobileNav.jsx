import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Eye } from 'lucide-react';
import { cn } from '../lib/utils';

const MobileNav = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-800 bg-slate-950/90 p-4 backdrop-blur-lg md:hidden">
            <NavLink
                to="/"
                className={({ isActive }) =>
                    cn(
                        "flex flex-col items-center gap-1 text-xs font-medium transition-colors",
                        isActive ? "text-blue-500" : "text-slate-500 hover:text-slate-300"
                    )
                }
            >
                <Home className="h-6 w-6" />
                <span>Home</span>
            </NavLink>
            <NavLink
                to="/scan"
                className={({ isActive }) =>
                    cn(
                        "flex flex-col items-center gap-1 text-xs font-medium transition-colors",
                        isActive ? "text-blue-500" : "text-slate-500 hover:text-slate-300"
                    )
                }
            >
                <Eye className="h-6 w-6" />
                <span>Scan</span>
            </NavLink>
        </div>
    );
};

export default MobileNav;
