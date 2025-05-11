import { useEffect, useState } from "react";
import axios from "axios";

const MyClassesPage = () => {
  const [events, setEvents] = useState([]);
  const employeeId = localStorage.getItem("employee_id"); // Zakładamy, że zapisujesz ID po logowaniu

  useEffect(() => {
    if (!employeeId) {
      console.error("Brak employee_id w localStorage");
      return;
    }

    axios
      .get("/api/trainer/myclasses/", {
        headers: {
          "Employee-ID": employeeId, // <-- przekazujemy jako nagłówek
        },
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, [employeeId]);

  return (
    <div>
      <h2>Moje zajęcia</h2>
      {events.map((ev) => (
        <div key={ev.id}>
          <h3>{ev.name}</h3>
          <p>{ev.date} o {ev.time}</p>
          <p>Sala: {ev.place}</p>
        </div>
      ))}
    </div>
  );
};

export default MyClassesPage;
