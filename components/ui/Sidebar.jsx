import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-gray-50 border-r">
      <nav className="mt-8">
        <ul className="space-y-2 px-4">
          <li>
            <Link href="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-100">
              Overview
            </Link>
          </li>
          <li>
            <Link href="/dashboard/students" className="block px-4 py-2 rounded hover:bg-gray-100">
              Students
            </Link>
          </li>
          <li>
            <Link href="/dashboard/classes" className="block px-4 py-2 rounded hover:bg-gray-100">
              Classes
            </Link>
          </li>
          <li>
            <Link href="/dashboard/teachers" className="block px-4 py-2 rounded hover:bg-gray-100">
              Teachers
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
