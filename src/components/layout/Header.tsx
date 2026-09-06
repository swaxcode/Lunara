/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Moon, Compass, LogOut } from 'lucide-react';

interface HeaderProps {
  currentTab: 'reflect' | 'sky';
  onTabChange: (tab: 'reflect' | 'sky') => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange, savedCount }) => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-[#1E2638] bg-[#0B0F19]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('reflect')}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#161B2E] via-[#2A2B45] to-[#E2C48D]/20 border border-[#E2C48D]/40 flex items-center justify-center shadow-sm">
            <Moon className="w-4 h-4 text-[#E2C48D]" />
          </div>
          <div>
            <span className="font-serif text-xl tracking-wider text-[#FDFCF7] font-medium block leading-none">
              LUNARA
            </span>
            <span className="text-[10px] tracking-widest uppercase text-[#9B94BE] block mt-0.5 font-light">
              Your Inner Sky
            </span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 bg-[#121724] p-1 rounded-full border border-[#1E2638]" role="tablist">
          <button
            id="tab-reflect"
            role="tab"
            aria-selected={currentTab === 'reflect'}
            onClick={() => onTabChange('reflect')}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              currentTab === 'reflect'
                ? 'bg-[#1E2638] text-[#FDFCF7] shadow-sm border border-[#2E3A54]'
                : 'text-[#9B94BE] hover:text-[#FDFCF7] hover:bg-[#161B2E]/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E2C48D]" />
            <span>Reflect</span>
          </button>

          <button
            id="tab-sky"
            role="tab"
            aria-selected={currentTab === 'sky'}
            onClick={() => onTabChange('sky')}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              currentTab === 'sky'
                ? 'bg-[#1E2638] text-[#FDFCF7] shadow-sm border border-[#2E3A54]'
                : 'text-[#9B94BE] hover:text-[#FDFCF7] hover:bg-[#161B2E]/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#7AA8B8]" />
            <span>Inner Sky</span>
            {savedCount > 0 && (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-[#E2C48D]/20 text-[#E2C48D] font-mono">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* User Session & Logout */}
        <div className="flex items-center space-x-3">
          {user && (
            <div className="flex items-center space-x-2.5">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User profile'}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full border border-[#2E3A54] object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#1E2638] border border-[#2E3A54] text-[#E2C48D] text-xs flex items-center justify-center font-medium">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <span className="text-xs text-[#9B94BE] hidden md:inline max-w-[120px] truncate font-light">
                {user.displayName || user.email?.split('@')[0]}
              </span>
              <button
                id="btn-logout"
                onClick={logout}
                title="Sign Out"
                aria-label="Sign Out"
                className="text-[#9B94BE] hover:text-[#FDFCF7] p-1.5 rounded-lg hover:bg-[#161B2E] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
