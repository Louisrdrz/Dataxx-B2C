export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100">
      <div className="container-page py-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-sm text-gray-600">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-6 rounded-md bg-primary-600" />
            <span className="font-semibold text-gray-900">Dataxx</span>
          </div>
          <p className="max-w-xs">Plateforme d'aide aux sportifs pour trouver, qualifier et signer des sponsors.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Produit</h4>
          <ul className="space-y-1">
            <li><a className="hover:text-gray-900" href="#pourquoi">Pourquoi Dataxx</a></li>
            <li><a className="hover:text-gray-900" href="#fonctionnement">Comment ça marche</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Ressources</h4>
          <ul className="space-y-1">
            <li><a className="hover:text-gray-900" href="#">Aide</a></li>
            <li><a className="hover:text-gray-900" href="#">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Compte</h4>
          <ul className="space-y-1">
            <li><a className="hover:text-gray-900" href="/login">Se connecter</a></li>
            <li><a className="hover:text-gray-900" href="/register">Créer un compte</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100">
        <div className="container-page py-6 text-center text-sm text-gray-600">
          Pour des sportifs. Par des sportifs.
        </div>
      </div>
    </footer>
  );
}


