interface Salle {
  id: number;
  name: string;
  capacity: number;
}

function Salle({ salle }: Salle) {
  return (
    <div
              key={salle.id}
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
  );
}

export default Salle;