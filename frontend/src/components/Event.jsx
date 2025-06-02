import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AxiosInstance from "./AxiosInstance.jsx";
import Section from "./Section.jsx";
import Heading from "./Heading.jsx";
import Button from "./Button.jsx";
import { isLoggedIn } from "../Utils/Auth.jsx";

const Event = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reserving, setReserving] = useState(false);
  const [reserveError, setReserveError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  const fetchEvent = async () => {
    try {
      const resp = await AxiosInstance.get(`events/${id}`);
      setEvent(resp.data);
      console.log(resp.data);
    } catch (err) {
      console.error("Blad podczas ladowania wydarzenia: ", err);
      setError("Nie udało się załadować wydarzenia.");
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    setReserving(true);
    setReserveError(null);

    try {
      const resp = await AxiosInstance.post(`events/${id}/reserve/`);
      setEvent(resp.data);
      console.log(resp.data);
    } catch (err) {
      console.error("Blad podczas rezerwacji: ", err.response || err);
      if (err.response && err.response.data && err.response.data.detail) {
        setReserveError(err.response.data.detail);
      } else {
        setReserveError("Nie udalo sie zapisac na zajecia");
      }
    } finally {
      setReserving(false);
    }
  };
  useEffect(() => {
    fetchEvent();
  }, [id]);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  if (loading) return <p>Ładowanie artykułu...</p>;
  if (error) return <p className={"text-red-500"}>{error}</p>;
  if (!event) return <p>Nie znaleziono artykułu</p>;

  return (
    <Section className={"container relative z-2"}>
      <Heading
        title={event.name}
        text={`Zajęcia odbędą się o godzinie ${event.time} dnia ${event.date}`}
      />

      <div className={"mt-6 space-y-4"}>
        <p className={"text-justify"}>{event.description}</p>
        <div className={""}>
          <p className={"font-semibold"}>
            Zajętych miejsc:{" "}
            <span className={"text-purple-600"}>{event.reserved_count}</span>
          </p>
          <p className="font-semibold">
            Wolnych miejsc:{" "}
            <span className="text-green-600">{event.remaining_spots}</span>
          </p>
        </div>
        {reserveError && <p className={"text-red-500"}>{reserveError}</p>}

        {event.remaining_spots > 0 ? (
          <Button
            onClick={
              loggedIn
                ? handleReserve
                : () =>
                    setReserveError(
                      "By zapisać się na zajęcia musisz być zalogowany",
                    )
            }
            disabled={reserving}
            className={reserving ? "opacity-50 cursos-not allowed" : ""}
            white={reserving}
          >
            {reserving ? "Rezerwuję..." : "Zapisz się na zajęcia"}
          </Button>
        ) : (
          <p className={"text-red-500"}>Brak wolnych miejsc</p>
        )}
      </div>
    </Section>
  );
};
export default Event;
