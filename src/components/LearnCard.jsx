import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function LearnCard() {

  return (

    <Link
      to="/learn"
      className="learn-card"
    >

      <div className="learn-icon">

        <BookOpen size={34} />

      </div>

      <div className="learn-content">

        <p className="eyebrow">

          APRENDE DESDE CERO

        </p>

        <h3>

          ¿Nunca has jugado Sudoku?

        </h3>

        <p>

          Aprende las reglas paso a paso y resuelve tu
          primer Sudoku en pocos minutos.

        </p>

      </div>

      <ArrowRight size={22}/>

    </Link>

  );

}