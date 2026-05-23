import Carte from './Carte';
import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import Footer from './Footer';

function App() {
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);
  const [nbRecherches, setNbRecherches] = useState(0);

  // ✅ Exercice 1 : fonction séparée pour pouvoir la réutiliser
  function chargerLignes() {
    setChargement(true);
    setErreur(null);
    fetch("http://localhost:5000/lignes")
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then(data => {
        setLignes(data);
        setChargement(false);
      })
      .catch(error => {
        setErreur(error.message);
        setChargement(false);
      });
  }

  // ✅ useEffect appelle la fonction
  useEffect(() => {
    chargerLignes();
  }, []);

  const lignesFiltrees = lignes.filter(l =>
    l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
    l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
    l.numero.includes(recherche)
  );

  function handleRecherche(texte) {
    setRecherche(texte);
    if (texte !== recherche) {
      setNbRecherches(n => n + 1);
    }
  }

function handleClickLigne(ligne) {
  if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
    setLigneSelectionnee(null);
  } else {
    // ✅ Exercice 3 : fetch les détails depuis Flask
    fetch(`http://localhost:5000/lignes/${ligne.id}`)
      .then(response => response.json())
      .then(data => setLigneSelectionnee(data))
      .catch(error => console.error("Erreur détail :", error));
  }
}
  if (chargement) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <p className="message-chargement">Chargement des lignes...</p>
        </main>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <div className="message-erreur">
            <p>Impossible de charger les lignes.</p>
            <p className="erreur-detail">{erreur}</p>
            <p>Vérifiez que le serveur Flask est lancé (python api/app.py).</p>
            {/* ✅ Bouton recharger aussi dans l'écran d'erreur */}
            <button className="btn-recharger" onClick={chargerLignes}>
              🔄 Recharger
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <Recherche valeur={recherche} onChange={handleRecherche} />
        {/* ✅ Bouton recharger */}
        <button className="btn-recharger" onClick={chargerLignes}>
          🔄 Recharger
        </button>
        <p className="compteur-recherche">
          Vous avez effectué {nbRecherches} recherche{nbRecherches > 1 ? 's' : ''}
        </p>
        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne{lignesFiltrees.length > 1 ? 's' : ''} trouvee{lignesFiltrees.length > 1 ? 's' : ''}
        </p>
        {lignesFiltrees.length === 0 ? (
          <p className="aucune-ligne">Aucune ligne trouvée pour "{recherche}"</p>
        ) : (
          lignesFiltrees.map(ligne => (
            <LigneBus
              key={ligne.id}
              numero={ligne.numero}
              depart={ligne.depart}
              arrivee={ligne.arrivee}
              arrets={ligne.arrets}
              estSelectionnee={ligneSelectionnee && ligneSelectionnee.id === ligne.id}
              onClick={() => handleClickLigne(ligne)}
            />
          ))
        )}
        {ligneSelectionnee && <DetailLigne ligne={ligneSelectionnee} />}
        {ligneSelectionnee && <DetailLigne ligne={ligneSelectionnee} />}
<Carte />   {/* NOUVEAU */}
      </main>
      <Footer />
    </div>
  );
}

export default App;