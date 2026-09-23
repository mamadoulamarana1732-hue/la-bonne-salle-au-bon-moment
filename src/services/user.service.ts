// src/services/salle.service.ts
export async function createUser(utilisateur: object) {
  const response = await fetch('http://localhost:3000/api/users/create', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(utilisateur),
  });

  return response.json();
}


