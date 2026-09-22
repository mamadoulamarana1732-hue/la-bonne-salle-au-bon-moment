// ---------- Imports --------
import './dashboard-formateur.css'
import Button from '../components/button';
import { useEffect, useState } from "react";
import { getSalles } from "../services/salle.service";
import { useNavigate } from 'react-router';

type Salle = {
  name: string;
  capacity: string;
  // site: string;
  // floor: number;
};

function DashboardFormateur() {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function chargerSalles() {
      try {
        const data = await getSalles();
        setSalles(data);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    }
    chargerSalles();
  }, []);

  if (loading) {
    return <p>Chargement des salles...</p>;
  }

  return (
    <>
      <header>
        <div>
          <Button description='se deconnecter' onClick={() => navigate('/')}/>
        </div>
      </header>

      <div className="p-6">
        <h1>
          Dashboard Formateur
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {salles.map((salle) => (
            <div
              key={salle.name}
              className="salle-card"
            >
              <h3 className="salle-title">
                {salle.name}
              </h3>
              {/*<p className="salle-info">
                Numéro : <strong>{salle.floor}</strong>
              </p>*/}
              <p className="salle-info">
                Capacité : <strong>{salle.capacity} personnes</strong>
              </p>
            </div>
          ))}
        </div>
      </div>

      <footer>
        <div>
          <Button description='effectuer une reservation' onClick={() => navigate('/creerReservation')} />
          <Button description='modifier une reservation' onClick={() => navigate('/modifierReservation')} />
          <Button description='supprimer une reservation' onClick={() => navigate('/listeReservations')} />
        </div>
      </footer>
    </>
  );
}

export default DashboardFormateur;
