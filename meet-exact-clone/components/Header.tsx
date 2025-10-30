import Link from 'next/link';
import { LinkButton } from '@/components/Button';

export function Header() {
  return (
    <header className="w-full border-b border-gray-100">
      <div className="container-page flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary-600" />
          <span className="text-lg font-semibold">Dataxx</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <Link href="#pourquoi" className="hover:text-gray-900">Pourquoi Dataxx</Link>
          <Link href="#fonctionnement" className="hover:text-gray-900">Comment ça marche</Link>
          <Link href="#contact" className="hover:text-gray-900">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          <LinkButton href="/login">Se connecter</LinkButton>
        </div>
      </div>
    </header>
  );
}


