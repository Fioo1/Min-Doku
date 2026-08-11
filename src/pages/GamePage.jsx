import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  Lightbulb,
  Pause,
  RotateCcw,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import SudokuBoard from "../components/SudokuBoard";
import NumberPad from "../components/NumberPad";
import {
  createPuzzle,
  dailySeed,
} from "../utils/sudoku";
import { useGame } from "../context/GameContext";
import DailyLeaderboard from "../components/DailyLeaderboard";

const labels = {
  easy: "Fácil",
  intermediate: "Intermedio",
  hard: "Difícil",
  master: "Maestro",
};

const normal = {
  easy: 20,
  intermediate: 40,
  hard: 70,
  master: 120,
};

const dailyReward = {
  easy: 20,
  intermediate: 50,
  hard: 80,
  master: 120,
};

export default function GamePage({ daily }) {

  const { difficulty = "easy" } = useParams();

  const nav = useNavigate();

  const {
    recordWin,
    spend,
  } = useGame();

  const fresh = () =>
    createPuzzle(
      difficulty,
      daily
        ? dailySeed(difficulty)
        : undefined
    );

  const [game, setGame] = useState(fresh);

  const [board, setBoard] = useState(
    game.puzzle.map((r) => [...r])
  );

  const [selected, setSelected] = useState(null);

  const [lives, setLives] = useState(3);

  const [seconds, setSeconds] = useState(0);

  const [paused, setPaused] = useState(false);

  const [notesMode, setNotesMode] = useState(false);

  const [notes, setNotes] = useState({});

  const [finished, setFinished] = useState(false);

  const [won, setWon] = useState(false);

  const [hints, setHints] = useState(0);

  const [wrong, setWrong] = useState(null);

  const time =
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60
    ).padStart(2, "0")}`;

  const done = useMemo(
    () =>
      [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
        (n) =>
          board.flat().filter((x) => x === n).length === 9
      ),
    [board]
  );

  useEffect(() => {

    if (paused || finished) return;

    const i = setInterval(
      () => setSeconds((x) => x + 1),
      1000
    );

    return () => clearInterval(i);

  }, [paused, finished]);

  const restart = () => {

    setBoard(
      game.puzzle.map((r) => [...r])
    );

    setLives(3);

    setSeconds(0);

    setNotes({});

    setHints(0);

    setWrong(null);

    setFinished(false);

    setWon(false);

  };

  const retry = () => {

    const next = fresh();

    setGame(next);

    setBoard(
      next.puzzle.map((r) => [...r])
    );

    setLives(3);

    setSeconds(0);

    setNotes({});

    setHints(0);

    setWrong(null);

    setFinished(false);

    setWon(false);

  };

  const enter = (n) => {

    if (
      !selected ||
      game.puzzle[selected.r][selected.c] ||
      finished
    ) {
      return;
    }

    const k =
      `${selected.r}-${selected.c}`;

    if (notesMode) {

      setNotes((x) => ({
        ...x,
        [k]: x[k]?.includes(n)
          ? x[k].filter((v) => v !== n)
          : [...(x[k] || []), n],
      }));

      return;

    }

    if (
      n !==
      game.solution[selected.r][selected.c]
    ) {

      const left = lives - 1;

      setWrong({
        r: selected.r,
        c: selected.c,
        value: n,
      });

      navigator.vibrate?.(90);

      setTimeout(
        () => setWrong(null),
        650
      );

      setLives(left);

      if (!left) {
        setFinished(true);
      }

      return;

    }

    const next = board.map((r) => [...r]);

    next[selected.r][selected.c] = n;

    setBoard(next);

    if (next.flat().every(Boolean)) {

      const coins = daily
        ? dailyReward[difficulty]
        : normal[difficulty];

      setWon(true);

      setFinished(true);

      recordWin({
        coins,
        xp: daily
          ? coins * 2
          : 100,
        seconds,
        difficulty,
        mistakes: 3 - lives,
        hintsUsed: hints,
        daily,
      });

    }

  };

  const erase = () => {

    if (
      selected &&
      !game.puzzle[selected.r][selected.c]
    ) {

      setBoard((x) =>
        x.map((r, i) =>
          r.map((v, j) =>
            i === selected.r &&
            j === selected.c
              ? 0
              : v
          )
        )
      );

    }

  };

  const hint = () => {

    if (
      !selected ||
      game.puzzle[selected.r][selected.c] ||
      !spend(25)
    ) {
      return;
    }

    setBoard((x) =>
      x.map((r, i) =>
        r.map((v, j) =>
          i === selected.r &&
          j === selected.c
            ? game.solution[i][j]
            : v
        )
      )
    );

    setHints((x) => x + 1);

  };

  return (

    <section className="game-page">

      <div className="game-top">

        <button
          className="back"
          onClick={() =>
            nav(
              daily
                ? "/daily"
                : "/"
            )
          }
        >
          ← Salir
        </button>

        <div>

          <p className="eyebrow">

            {
              daily
                ? "DESAFÍO MULTIJUGADOR"
                : "NUEVA PARTIDA"
            }

          </p>

          <h2>
            {labels[difficulty]}
          </h2>

        </div>

        <div className="game-status">

          <span className="timer">
            {time}
          </span>

          <span className="lives">

            {[0, 1, 2].map((i) => (

              <Heart
                key={i}
                fill={
                  i < lives
                    ? "currentColor"
                    : "none"
                }
              />

            ))}

          </span>

        </div>

      </div>

      {wrong && (

        <p className="mistake-alert">

          Número incorrecto.
          Te quedan {lives} vidas.

        </p>

      )}

      <div className="play-zone">

        <div>

          <SudokuBoard
            board={board}
            givens={game.puzzle}
            selected={selected}
            onSelect={setSelected}
            notes={notes}
            wrongCell={wrong}
          />

          <NumberPad
            onNumber={enter}
            onErase={erase}
            disabled={
              paused || finished
            }
            completed={done}
          />

        </div>

        <div className="tools">

          <button
            onClick={() =>
              setPaused(!paused)
            }
          >

            <Pause />

            {
              paused
                ? "Reanudar"
                : "Pausar"
            }

          </button>

          <button
            className={
              notesMode
                ? "chosen"
                : ""
            }
            onClick={() =>
              setNotesMode(!notesMode)
            }
          >

            ✎ Notas

          </button>

          <button onClick={hint}>

            <Lightbulb />

            Pista

            <small>
              25 ●
            </small>

          </button>

          {!daily && (

            <button onClick={restart}>

              <RotateCcw />

              Reiniciar tablero

            </button>

          )}

        </div>

      </div>

      {finished && (

        <div className="modal">

          <div className="modal-card">

            <span>

              {won
                ? "✦"
                : "♡"}

            </span>

            <h2>

              {
                won
                  ? "¡Tablero completado!"
                  : "Game over"
              }

            </h2>

            <div className="result">

              <b>

                {time}

                <small>
                  tiempo
                </small>

              </b>

              <b>

                {3 - lives}

                <small>
                  errores
                </small>

              </b>

              <b>

                +
                {
                  won
                    ? (
                      daily
                        ? dailyReward[difficulty]
                        : normal[difficulty]
                    )
                    : 0
                }

                <small>
                  monedas
                </small>

              </b>

            </div>

            {daily && won && (

              <DailyLeaderboard
                difficulty={difficulty}
              />

            )}

            <button
              className="secondary-button"
              onClick={() =>
                nav(
                  daily
                    ? "/daily"
                    : "/"
                )
              }
            >

              Salir

            </button>

            {!daily && (
              <button
                className="text-action modal-retry"
                onClick={retry}
              >
                Volver a intentarlo
              </button>
            )}

          </div>

        </div>

      )}

    </section>

  );

}
