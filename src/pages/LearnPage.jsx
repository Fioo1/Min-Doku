import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Brain, PlayCircle } from "lucide-react";

export default function LearnPage() {

  return (

    <section className="learn-page">

      <Link to="/" className="back">

        <ArrowLeft size={18} />

        Volver

      </Link>

      <div className="learn-hero">

        <Brain size={54} />

        <h1>Aprende a jugar Sudoku</h1>

        <p>

          Sudoku es un juego de lógica que ayuda a desarrollar la concentración,
          la memoria y el razonamiento. No necesitas hacer operaciones
          matemáticas: solo observar, analizar y deducir.

        </p>

      </div>

      <div className="learn-grid">

        <article className="learn-box">

          <BookOpen size={28} />

          <h2>Regla 1</h2>

          <p>

            Cada fila debe contener los números del 1 al 9,
            sin repetir ninguno.

          </p>

        </article>

        <article className="learn-box">

          <BookOpen size={28} />

          <h2>Regla 2</h2>

          <p>

            Cada columna debe contener los números del 1 al 9,
            sin repetir ninguno.

          </p>

        </article>

        <article className="learn-box">

          <BookOpen size={28} />

          <h2>Regla 3</h2>

          <p>

            Cada bloque de 3×3 debe contener los números del 1 al 9,
            sin repetir ninguno.

          </p>

        </article>

      </div>

      <section className="learn-example">

        <h2>¿Cómo resolver un Sudoku?</h2>

        <p>

          Observa una fila, luego una columna y finalmente el bloque de 3×3.
          Si un número ya está presente en alguno de ellos, no puede repetirse.
          Poco a poco irás descartando opciones hasta encontrar el número correcto.

        </p>

      </section>

      <section className="learn-finish">

        <PlayCircle size={40} />

        <h2>¡Ya estás listo!</h2>

        <p>

          Ahora que conoces las reglas básicas,
          es momento de comenzar tu aventura en MinDoku.

        </p>

        <Link to="/" className="primary-button">

          Comenzar a jugar

        </Link>

      </section>

    </section>

  );

}