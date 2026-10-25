import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <span className="text-8xl font-black font-display text-brand-600 block mb-2 tracking-tight">
          404
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-display mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-600 text-sm mb-8 leading-relaxed">
          The showroom page or vehicle listing you are looking for does not exist or has been relocated.
        </p>
        <Link to="/">
          <Button variant="primary" size="md">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
