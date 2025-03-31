import Link from 'next/link';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from '@/components/ui/navigation-menu';

export default function Navbar() {
  return (
    <header className="bg-white border-b px-8 py-4">
      <div className="flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold">School Admin</Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/dashboard">Dashboard</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/login">Logout</Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
