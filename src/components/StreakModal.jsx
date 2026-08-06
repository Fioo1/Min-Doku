export default function StreakModal({
  streak,
  shields,
  onUseShield,
  onLoseStreak,
}) {
  return (
    <div className="modal">

      <div className="modal-card">

        <span style={{ fontSize: "48px" }}>
          🛡️
        </span>

        <h2>¡Protege tu racha!</h2>

        <p>
          Ayer no completaste ningún Sudoku.
        </p>

        <div className="result">

          <b>
            🔥 {streak}
            <small>días</small>
          </b>

          <b>
            🛡️ {shields}
            <small>escudos</small>
          </b>

        </div>

        <button
          className="primary-button"
          onClick={onUseShield}
        >
          Usar escudo
        </button>

        <button
          className="secondary-button"
          onClick={onLoseStreak}
        >
          Perder racha
        </button>

      </div>

    </div>
  );
}