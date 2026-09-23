// src/services/salle.service.ts
export async function createSalle(salle: object) {
  const response = await fetch('http://localhost:3000/api/salles/create', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(salle),
  });
  return response.json();
}

const API_URL = "http://localhost:3000/api/salles/";

export async function getSalles() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les salles");
  }

  return response.json();
}
