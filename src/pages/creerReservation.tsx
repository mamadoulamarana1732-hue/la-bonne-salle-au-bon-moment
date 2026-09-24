// ---------- Imports --------
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import './creerReservation.css';
import Button from '../components/button';

// const API_URL = 'http://localhost:3000/api/reservations/create';

//--------- Types ---------
interface Salle {
  _id: string;
  label: string;
  capacity: number;
  site: string;
  building: string;
  floor: number;
}

//--------- Component ---------
function CreerReservation() {
  const navigate = useNavigate();

  const [salles, setSalles] = useState<Salle[]>([]);
  const [salleId, setSalleId] = useState('');
  const [date, setDate] = useState('');
  const [heureDebut, setHeureDebut] = useState('');
  const [heureFin, setHeureFin] = useState('');
  const [motif, setMotif] = useState('');
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/salles/')
      .then((res) => res.json())
      .then((data) => setSalles(data))
      .catch(() => setErreur('Impossible de charger la liste des salles'));
  }, []);

  const handleSubmit = async () => {
    setErreur('');

    if (!salleId || !date || !heureDebut || !heureFin) {
      setErreur('Merci de remplir tous les champs obligatoires.');
      return;
    }

    if (heureFin <= heureDebut) {
      setErreur("L'heure de fin doit être après l'heure de début.");
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/reservations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salleId,
          date,
          heureDebut,
          heureFin,
          motif,
          //userId: currentUser?.id, // AJOUT
          // userId: currentUser?.id==="6a9a9480c8edf4a99b032c5e"
        }),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la création de la réservation');
      }

      navigate('/DashboardAdmin');
    } catch (err) {
      setErreur("La réservation n'a pas pu être créée.");
    }
  };

  return (
    <>
      <header>
        <div>
          <Button description="retour" onClick={() => navigate('/DashboardAdmin')} />
        </div>
      </header>
      <main>
        <div className="form-container">
          <h1>Ajouter une réservation</h1>

          <label htmlFor="salle">Salle</label>
        <select onChange={(e) => setSalleId(e.target.value)}>
              {salles.map((salle) => (
                <option key={salle._id} value={salle._id}>
                  Salle {salle.label} (Bâtiment {salle.building}, étage {salle.floor})
                </option>
              ))}
        </select>

          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label htmlFor="heureDebut">Heure de début</label>
          <input
            id="heureDebut"
            type="time"
            value={heureDebut}
            onChange={(e) => setHeureDebut(e.target.value)}
          />

          <label htmlFor="heureFin">Heure de fin</label>
          <input
            id="heureFin"
            type="time"
            value={heureFin}
            onChange={(e) => setHeureFin(e.target.value)}
          />

          <label htmlFor="motif">Motif</label>
          <input
            id="motif"
            type="text"
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            placeholder="Réunion, formation, etc."
          />

          {erreur && <p className="erreur">{erreur}</p>}
        </div>
      </main>
      <footer>
        <div>
          <Button description="valider la réservation" onClick={handleSubmit} />
        </div>
      </footer>
    </>
  );
}

export default CreerReservation;
