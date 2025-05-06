
import React from 'react';
import { CalendarDays } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <CalendarDays size={28} />
          <h1 className="text-xl font-bold">월간 태스크 뮤즈</h1>
        </div>
        <div>
          <p className="text-sm">{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
