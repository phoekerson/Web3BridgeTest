// Header component for the application

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Personal Finance Tracker
        </Link>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/?view=transactions" className="text-gray-600 hover:text-blue-600">
                Transactions
              </Link>
            </li>
            <li>
              <Link href="/?view=categories" className="text-gray-600 hover:text-blue-600">
                Categories
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}