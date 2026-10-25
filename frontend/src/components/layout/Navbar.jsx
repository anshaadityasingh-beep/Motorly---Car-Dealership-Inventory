import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-glow-brand transition-transform group-hover:scale-105">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold font-display tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                ApexMotors
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-widest font-semibold text-slate-400">
                Premium Dealership
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors ${
                isActive('/') ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Showroom
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  isActive('/admin') ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Admin Panel</span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              </Link>
            )}
          </nav>

          {/* User profile & controls */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900 leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{user.email}</p>
                </div>
                <Badge variant={isAdmin ? 'warning' : 'brand'} size="sm">
                  {isAdmin ? 'ADMIN' : 'CLIENT'}
                </Badge>
                <Button variant="ghost" size="sm" onClick={logout} className="text-slate-600 hover:text-rose-600">
                  Sign out
                </Button>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 animate-fadeIn">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/') ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Showroom
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive('/admin') ? 'bg-amber-50 text-amber-800' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Admin Panel
            </Link>
          )}

          {user && (
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3 px-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <Badge variant={isAdmin ? 'warning' : 'brand'} size="sm">
                  {isAdmin ? 'ADMIN' : 'CLIENT'}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                Sign out
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
