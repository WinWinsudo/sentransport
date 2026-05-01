import './StatReseau.css';

function StatReseau({ lignes }) {
  // Nombre total de lignes
  const totalLignes = lignes.length;

  // Nombre total d'arrêts (somme)
  const totalArrets = lignes.reduce((sum, ligne) => sum + ligne.arrets, 0);

  // Ligne avec le plus d'arrêts
  const ligneMax = lignes.reduce((max, ligne) =>
    ligne.arrets > max.arrets ? ligne : max
  );

  return (
    <div className="stat-reseau">
      <div className="stat-item">
        <span className="stat-chiffre">{totalLignes}</span>
        <span className="stat-label">lignes</span>
      </div>
      <div className="stat-item">
        <span className="stat-chiffre">{totalArrets}</span>
        <span className="stat-label">arrêts au total</span>
      </div>
      <div className="stat-item">
        <span className="stat-chiffre">Ligne {ligneMax.numero}</span>
        <span className="stat-label">plus d'arrêts ({ligneMax.arrets})</span>
      </div>
    </div>
  );
}

export default StatReseau;