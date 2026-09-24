import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import './listeReservations.css';
import Button from '../components/button';

const API_URL = 'http://localhost:3000/api';

//--------- Types ---------
interface Reservation {
  _id: string;
  salleId: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  motif: string;
}

interface Salle {
  id: string;
  label: string;
}

//--------- Component ---------
function ListeReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [salles, setSalles] = useState<Salle[]>([]);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

   function fetchData() {
    Promise.all([
      fetch(`${API_URL}/reservations`).then((res) => res.json()),
      fetch(`${API_URL}/salles`).then((res) => res.json()),
    ])
      .then(([reservationsData, sallesData]) => {
        setReservations(reservationsData);
        setSalles(sallesData);
      })
      .catch(() => setErreur('Impossible de charger les réservations.'));
  }

  function getNomSalle(salleId: string) {
    const salle = salles.find((s) => s.id === salleId);
    return salle ? salle.label : salleId;
}

  async function annulerReservation(_id: string) {
    const confirme = window.confirm('Annuler cette réservation ?');
    if (!confirme) return;

    try {
      const res = await fetch(`${API_URL}/reservations/delete/${_id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setReservations((prev) => prev.filter((r) => r._id !== _id));
    } catch (err) {
      setErreur("La réservation n'a pas pu être annulée.");
    }
  }

  return (
    <>
      <header>
        <div>
          <Button description="retour" onClick={() => navigate('/dashboardAdmin')} />
        </div>
      </header>
      <main>
        <div className="liste-container">
          <h1>Réservations</h1>

          {erreur && <p className="erreur">{erreur}</p>}

          {reservations.length === 0 ? (
            <p>Aucune réservation pour le moment.</p>
          ) : (
            <ul>
              {reservations.map((r) => (
                <li key={r._id} className="reservation-item">
                  <span>
                    <strong>{getNomSalle(r.salleId)}</strong> — {r.date} de{' '}
                    {r.heureDebut} à {r.heureFin}
                    {r.motif && ` (${r.motif})`}
                  </span>
                  <Button
                    description="annuler"
                    onClick={() => annulerReservation(r._id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}

export default ListeReservations;
