// Imports
import { useState } from 'react';
import './connexion.css';
import { useForm } from 'react-hook-form'; 
import { z } from 'zod'; 
import { zodResolver } from '@hookform/resolvers/zod'; // AJOUT : pont entre Zod et RHF
import { checkEmailMdp } from '../services/connexion.service';
import Button from '../components/button';



//Component : connexion page
function Connexion() {

    const loginSchema = z.object({
        email: z
            .string()
            .min(1, "L'email est obligatoire")
            .email("L'email est invalide"),
        password: z
            .string()
            .min(1, "Le mot de passe est obligatoire")
            .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    });

    type LoginFormData = z.infer<typeof loginSchema>;



    const [message, setMessage] = useState<string>(""); // CONSERVÉ : message de résultat de connexion, affiché après clic

    // AJOUT : mise en place de React Hook Form + Zod (repris du collègue)
    const {
        register, // Pour enregistrer et récupérer les champs d'un formulaire par nom
        handleSubmit, // Gérer la soumission du formulaire
        formState: { errors }, // Récupère les erreurs de validation
    } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

    // Fonctions
    async function onSubmit(data: LoginFormData) {
        const isValid = await checkEmailMdp(data.email, data.password); // CONSERVÉ : ton appel au service + json-server
        setMessage(isValid ? "Connexion réussie" : "Identifiant ou mot de passe incorrect"); // CONSERVÉ
    }

    // Component render
    return (
        <>
            <div>
                <h2>Authentification</h2> <br />
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label>Identifiant</label>
                            <input
                                type="email"
                                {...register("email")}
                            />
                            {errors.email && (<p>{errors.email.message}</p>)} {/* AJOUT : affichage de l'erreur de validation */}
                        </div>
                        <div>
                            <label>Mot de passe</label>
                            <input
                                type="password"
                                {...register("password")} // AJOUT : enregistrement du champ dans RHF
                            />
                            {errors.password && (<p>{errors.password.message}</p>)} {/* AJOUT */}
                        </div>
                        <button type="submit">Se connecter</button>
                    </form>
                    {message && <p>{message}</p>}
                    
                </div>
            </div>
        </>
    )
}
export default Connexion;