// ---------- Imports --------
import './dashboard-admin.css';
import Button from '../components/button';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000/api/salles';

interface SalleData {
  id: string;
  label: string;
  capacity: number;
  site: string;
  building: string;
  floor: number;
  material: string[];
}

//--------- Component ---------
function DashboardAdmin(){
  const navigate = useNavigate();
   const [salles, setSalles] = useState<SalleData[]>([]);

   useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setSalles(data))
      .catch((err) => console.error('Erreur lors du chargement des salles', err));
  }, []);
  
    return (
      <>  
        <header>
          <div>
            <Button description='se deconnecter' onClick={() => navigate('/')}/>
          </div>
        </header>
      <div className="p-6">
        <h1>
          Dashboard Administrateur
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {salles.map((salle) => (
            <div
              key={salle.label}
              className="salle-card"
            >
              <h3 className="salle-title">
                {salle.label}
              </h3>
              <p className="salle-info">
                Numéro : <strong>{salle.floor}</strong>
              </p>
              <p className="salle-info">
                Capacité : <strong>{salle.capacity} personnes</strong>
              </p>
            </div>
          ))}
        </div>
      </div>
        <footer>
          <div>
            <Button description='ajouter une salle' onClick={() => navigate('/CreerSalle')}/>
            <Button description='créer un compte' onClick={() => navigate('/CreateUserForm')}/>
            <Button description='ajouter une reservation' onClick={() => navigate('/creerReservation')}/>
            <Button description='modifier une reservation' onClick={() => navigate('/modifierReservation')}/>
            <Button description='supprimer une reservation' onClick={() => navigate('/listeReservations')}/>
          </div>
        </footer>
      </>
    )

}

export default DashboardAdmin;

