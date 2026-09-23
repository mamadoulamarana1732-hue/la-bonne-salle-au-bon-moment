// //----------- Imports -----------
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { createSalle } from '../services/salle.service';
// import './creerSalle.css';
// import Button from '../components/button';


// //----------- Logic -----------
// // Validation schema
// const creerSalleSchema = z.object({
//     label: z
//         .string()
//         .min(3, "Le nom de la salle doit avoir au minimum 3 caractères."),
//     capacity: z
//         .number()
//         .positive("La capacité doit être supérieure à 0."),
//     size: z
//         .string()
//         .min(1, "La taille doit avoir au minimum 1 caractères."),
//     building: z
//         .string()
//         .min(6, "Le bâtiment doit avoir au minimum 6 caractère."),
//     floor: z.number(),
// });

// type CreerSalleFormData = z.infer<typeof creerSalleSchema>;

// //---------- Component render ----------
// function CreerSalle() {
//     // Navigation
//     const navigate = useNavigate();
//     // Message display (after click on the submit button)
//     const [message, setMessage] = useState<string>("");

//     // Zod
//     const { register, handleSubmit, formState: { errors }, reset } = useForm<CreerSalleFormData>({
//         resolver: zodResolver(creerSalleSchema),
//     });

//     async function onSubmit(data: CreerSalleFormData) {
//         try {
//             await createSalle(data);
//             reset();
//             setMessage("Salle ajoutée");
//         } catch (error) {
//             console.error(error);
//             setMessage("Erreur lors de l'ajout de la salle");
//         }
//     }

//     return (
//         <>
//             <header>
//                 <div>
//                     <Button description="retour" onClick={() => navigate('/DashboardAdmin')} />
//                 </div>
//             </header>
//             <main>
//                 <div className='container'>
//                     <h2>Ajouter une nouvelle salle</h2>
//                     <form onSubmit={handleSubmit(onSubmit)}>
//                         <div>
//                             <label>Nom de salle</label>
//                             <input type="text" {...register("label")} placeholder='Salle informatique' />
//                             {errors.label && <p>{errors.label.message}</p>}
//                         </div>

//                         <div>
//                             <label>Capacité d'accueil</label>
//                             <input type="number" {...register("capacity", { valueAsNumber: true })} min={0} />
//                             {errors.capacity && <p>{errors.capacity.message}</p>}
//                         </div>

//                         <div>
//                             <label>Taille de la Salle</label>
//                             <input type="text" {...register("size")} placeholder='Taille' />
//                             {errors.size && <p>{errors.size.message}</p>}
//                         </div>

//                         <div>
//                             <label>Bâtiment</label>
//                             <input type="text" {...register("building")} placeholder='Bâtiment Charles Xavier' />
//                             {errors.building && <p>{errors.building.message}</p>}
//                         </div>

//                         <div>
//                             <label>Etage</label>
//                             <input type="number" {...register("floor", { valueAsNumber: true })} min={0} placeholder='3' />
//                             {errors.floor && <p>{errors.floor.message}</p>}
//                         </div>

//                         <button type="submit">Valider</button>
//                         {message && <p>{message}</p>}
//                     </form>
//                 </div>
//             </main>
//         </>
//     );
// }

// export default CreerSalle;

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { createSalle } from '../services/salle.service';
import './creerSalle.css';
import Button from '../components/button';


//----------- Logic -----------
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
                            <input type="number" {...register("floor", { valueAsNumber: true })} min={0} placeholder='3' />
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