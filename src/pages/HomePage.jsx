import {
  ArrowRight,
  CalendarDays,
  Play,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useGame } from "../context/GameContext";
import LearnCard from "../components/LearnCard";

const list = [
  ["easy", "Fácil", "42 pistas", "20"],
  ["intermediate", "Intermedio", "35 pistas", "40"],
  ["hard", "Difícil", "29 pistas", "70"],
  ["master", "Maestro", "24 pistas", "120"],
];

const hello = () => {
  const h = new Date().getHours();

  if (h < 12) return "BUENOS DÍAS";
  if (h < 19) return "BUENAS TARDES";

  return "BUENAS NOCHES";
};

export default function HomePage() {
  const { player } = useGame();

  return (
    <section className="home">
      <div className="hero">
        <div>
          <p className="eyebrow">
            {hello()}, {player.name.toUpperCase()}
          </p>

          <h1>
            Entrena tu mente.
            <br />
            <em>Domina el tablero.</em>
          </h1>

          <p className="hero-copy">
            MinDoku es un juego de lógica diseñado para todas las edades.
            Aprende desde cero o desafíate con niveles cada vez más difíciles
            mientras mejoras tu concentración, memoria y razonamiento.
          </p>

          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "30px",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/play/easy"
              className="primary-button"
            >
              <Play
                size={18}
                fill="currentColor"
              />
              Jugar ahora
            </Link>

            <Link
              to="/learn"
              className="secondary-button"
            >
              <BookOpen size={18} />
              Aprender Sudoku
            </Link>
          </div>
        </div>

        <div className="hero-art">
          <Sparkles />

          <div className="mini-grid">
            {Array.from({ length: 16 }, (_, i) => (
              <b key={i}>
                {[1, "", 4, "", "", 3, "", 2, 2, "", 1, "", "", 4, "", 3][i]}
              </b>
            ))}
          </div>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <p className="eyebrow">ELIGE TU RITMO</p>
          <h2>Nueva partida</h2>
        </div>
      </div>

      <div className="difficulty-grid">
        {list.map(([id, name, detail, reward]) => (
          <Link
            key={id}
            to={`/play/${id}`}
            className={`difficulty ${id}`}
          >
            <span className="difficulty-dot" />

            <div>
              <h3>{name}</h3>
              <p>{detail}</p>
            </div>

            <strong>
              +{reward}
              <small> monedas</small>
            </strong>

            <ArrowRight size={18} />
          </Link>
        ))}
      </div>

      {/* Tarjeta para aprender Sudoku */}
      <LearnCard />

      <Link
        to="/daily"
        className="daily"
      >
        <div className="daily-icon">
          <CalendarDays />
        </div>

        <div>
          <p className="eyebrow">
            DESAFÍO MULTIJUGADOR
          </p>

          <h3>
            El tablero de hoy te espera
          </h3>

          <span>
            Compite por el mejor tiempo
          </span>
        </div>

        <ArrowRight />
      </Link>
    </section>
  );
}