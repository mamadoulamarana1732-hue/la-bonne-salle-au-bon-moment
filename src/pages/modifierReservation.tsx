// ---------- Imports --------
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import './creerReservation.css';
import Button from '../components/button';


//--------- Types ---------
interface Salle {
  _id: string;
  label: string;
  capacity: number;
  site: string;
  building: string;
  floor: number;
}

interface Reservation {
  _id: string;
  salleId: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  motif: string;
}

// Vérifie qu'aucune AUTRE réservation (idAExclure = celle en cours de modification) n'occupe déjà la même salle sur le même créneau.
function estDisponible(
  reservations: Reservation[],
  salleId: string,
  date: string,
  heureDebut: string,
  heureFin: string,
  idAExclure: string,
): boolean {
  return !reservations.some((r) =>
    r._id !== idAExclure &&
    r.salleId === salleId &&
    r.date === date &&
    heureDebut < r.heureFin &&
    r.heureDebut < heureFin
  );
}

//--------- Component ---------
function ModifierReservation() {
  const navigate = useNavigate();

  const [salles, setSalles] = useState<Salle[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationId, setReservationId] = useState('');

  const [salleId, setSalleId] = useState('');
  const [date, setDate] = useState('');
  const [heureDebut, setHeureDebut] = useState('');
  const [heureFin, setHeureFin] = useState('');
  const [motif, setMotif] = useState('');

  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3000/api/salles`)
      .then((res) => res.json())
      .then((data) => setSalles(data))
      .catch(() => setErreur('Impossible de charger la liste des salles'));

    fetch(`http://localhost:3000/api/reservations`)
      .then((res) => res.json())
      .then((data) => setReservations(data))
      .catch(() => setErreur('Impossible de charger la liste des réservations'));
  }, []);

  function selectionnerReservation(id: string) {
    setReservationId(id);
    setErreur('');
    setSucces('');

    const reservation = reservations.find((r) => r._id === id);
    if (!reservation) return;

    setSalleId(reservation.salleId);
    setDate(reservation.date);
    setHeureDebut(reservation.heureDebut);
    setHeureFin(reservation.heureFin);
    setMotif(reservation.motif);
  }

  const handleSubmit = async () => {
    setErreur('');
    setSucces('');

    if (!reservationId) {
      setErreur('Merci de sélectionner une réservation à modifier.');
      return;
    }

    const reservation = reservations.find((r) => r._id === reservationId);
    if (!reservation) {
      setErreur('Réservation introuvable.');
      return;
    }

    if (!salleId || !date || !heureDebut || !heureFin) {
      setErreur('Merci de remplir tous les champs obligatoires.');
      return;
    }

    const debut = new Date(`${date}T${heureDebut}`);
    const fin = new Date(`${date}T${heureFin}`);

    if (fin <= debut) {
      setErreur("L'heure de fin doit être après l'heure de début.");
      return;
    }

    if (fin < new Date()) {
      setErreur('La date de fin ne peut pas être dans le passé.');
      return;
    }

    if (!estDisponible(reservations, salleId, date, heureDebut, heureFin, reservationId)) {
      setErreur('Aucune salle disponible sur ce créneau. Modification impossible.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/reservations/update/${reservationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reservation,
          salleId,
          date,
          heureDebut,
          heureFin,
          motif,
        }),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la modification de la réservation');
      }

      setSucces('Réservation modifiée avec succès.');
    } catch {
      setErreur("La réservation n'a pas pu être modifiée.");
    }
  };

  return (
    <>
      <header>
        <div>
          <Button description="retour" onClick={() => navigate('/')} />
        </div>
      </header>
      <main>
        <div className="form-container">
          <h1>Modifier une réservation</h1>

          <label htmlFor="reservation">Réservation</label>
          <select
            id="reservation"
            value={reservationId}
            onChange={(e) => selectionnerReservation(e.target.value)}
          >
            <option value="">-- Choisir une réservation --</option>
            {reservations.map((r) => {
              const salle = salles.find((s) => s._id === r.salleId);
              return (
                <option key={r._id} value={r._id}>
                  {salle ? salle.label : r.salleId} — {r.date} {r.heureDebut}-{r.heureFin}
                </option>
              );
            })}
          </select>

          {reservationId && (
            <>
              <label htmlFor="salle">Salle</label>
              <select
                id="salle"
                value={salleId}
                onChange={(e) => setSalleId(e.target.value)}
              >
                {salles.map((s) => (
                  <option key={s._id} value={s._id}>
                    Salle {s.label} ({s.building}, étage {s.floor})
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
            </>
          )}

          {erreur && <p className="erreur">{erreur}</p>}
          {succes && <p className="succes">{succes}</p>}
        </div>
      </main>
      <footer>
        <div>
          <Button description="valider la modification" onClick={handleSubmit} />
        </div>
      </footer>
    </>
  );
}

export default ModifierReservation;
