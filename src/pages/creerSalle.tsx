import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { createSalle } from '../services/salle.service';
import './creerSalle.css';
import Button from '../components/button';

type CreerSalleFormData = {
    label: string;
    capacity: number;
    size: string;
    building: string;
    floor: number;
};


function CreerSalle() {
    
    const navigate = useNavigate();
    
    const [message, setMessage] = useState<string>("");

    const { register, handleSubmit, reset } = useForm<CreerSalleFormData>();

    async function onSubmit(data: CreerSalleFormData) {
        try {
            await createSalle(data);
            reset();
            setMessage("Salle ajoutée");
            navigate('/dashboardAdmin');
        } catch (error) {
            console.error(error);
            setMessage("Erreur lors de l'ajout de la salle");
        }
    }

    return (
        <>
            <header>
                <div>
                    <Button description="retour" onClick={() => navigate('/DashboardAdmin')} />
                </div>
            </header>
            <main>
                <div className='container'>
                    <h2>Ajouter une nouvelle salle</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label>Nom de salle</label>
                            <input type="text" {...register("label")} placeholder='Salle informatique' />
                        </div>

                        <div>
                            <label>Capacité d'accueil</label>
                            <input type="number" {...register("capacity", { valueAsNumber: true })}/>
                        </div>

                        <div>
                            <label>Taille de la Salle</label>
                            <input type="text" {...register("size")} placeholder='Taille' />
                        </div>

                        <div>
                            <label>Bâtiment</label>
                            <input type="text" {...register("building")} placeholder='Bâtiment Charles Xavier' />
                        </div>

                        <div>
                            <label>Etage</label>
                            <input type="number" {...register("floor", { valueAsNumber: true })} placeholder='3' />
                        </div>

                        <button type="submit">Valider</button>
                        {message && <p>{message}</p>}
                    </form>
                </div>
            </main>
        </>
    );
}

export default CreerSalle;