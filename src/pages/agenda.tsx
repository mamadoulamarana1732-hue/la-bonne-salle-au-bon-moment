import Button from '../components/button';
import { useEffect, useState } from 'react';

import FullCalendar, { useCalendarController } from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/monarch"; // YOUR THEME
import timeGridPlugin from '@fullcalendar/react/timegrid';


// stylesheets
import '@fullcalendar/react/skeleton.css'; // ALWAYS NEED SKELETON
import '@fullcalendar/react/themes/monarch/theme.css'; // YOUR THEME
import '@fullcalendar/react/themes/monarch/palettes/blue.css'; // YOUR THEME'S PALETTE


function Agenda() {
	//---Logic
	const API_URL = 'http://localhost:3001';

	interface SalleData {
		id: string;
		label: string;
		capacity: number;
		site: string;
		building: string;
		floor: number;
		material: string[];
	}
	interface ReservationData {
		salleId: string;
		date: string;
		heureDebut: string;
		heureFin: string;
		motif: string;
		userId: string;
		id: string;
	}
	interface eventData {
		title: string;
		start: string;
		end: string;
	}
	//var
	const controller = useCalendarController();
	const [salles, setSalles] = useState<SalleData[]>([]);
	const [reservations, setReservations] = useState<ReservationData[]>([]);
	const [events, setEvents] = useState<eventData[]>([]);

	useEffect(() => {
		fetch(`${API_URL}/salles`)
			.then((res) => res.json())
			.then((data) => setSalles(data))
			.catch((err) => console.error('Erreur lors du chargement des salles', err));
		fetch(`${API_URL}/reservations`)
			.then((res) => res.json())
			.then((data) => setReservations(data))
			.catch((err) => console.error('Erreur lors du chargement des réservations', err));
	}, []);

	function setSchedule(id: string) {
		let eventsTemp: eventData[] = [];
		reservations.forEach((res) => {
			if (res.salleId === id) {
				eventsTemp.push({
					title: res.motif,
					start: res.date + "T" + res.heureDebut,
					end: res.date + "T" + res.heureFin,
				})
			}
		})
		if (eventsTemp.length == 0) {
			eventsTemp = [];
		} else {
			setEvents(eventsTemp);
		}

	}


	//---Render 
	return (
		<>
			<select onChange={() => setSchedule((document.getElementById("salleSelect") as HTMLSelectElement).value)} id="salleSelect">
				<option>--Veuillez choisir une salle--</option>
				{salles.map((salle, index) => (
					<option key={index} value={salle.id}>{salle.label}</option>
				))}
			</select>
			<div>
				<Button
					description="Semaine précedente"
					onClick={() => controller.prev()}
				/>
				<Button
					description="Aujourd'hui"
					onClick={() => controller.today()}
				/>
				<Button
					description="Semaine suivante"
					onClick={() => controller.next()}
				/>
			</div>
			<FullCalendar
				controller={controller}
				plugins={[themePlugin, timeGridPlugin]}
				initialView="timeGridWeek"
				slotMinTime="07:00:00"
				slotMaxTime="19:00:00"
				nowIndicator={true}
				weekends={false}
				height={500}
				events={events}


			/>
		</>

	);
}
export default Agenda;