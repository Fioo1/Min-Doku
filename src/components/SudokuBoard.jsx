export default function SudokuBoard({
  board,
  givens,
  selected,
  onSelect,
  notes,
  wrongCell
}) {

  return (

    <div className="sudoku-board">

      {board.flatMap((row, r) =>
        row.map((value, c) => {

          const wrong =
            wrongCell?.r === r &&
            wrongCell?.c === c;

          const show =
            wrong ? wrongCell.value : value;

          const key = `${r}-${c}`;

          const active =
            selected?.r === r &&
            selected?.c === c;

          const peer =
            selected &&
            (
              selected.r === r ||
              selected.c === c ||
              (
                Math.floor(selected.r / 3) === Math.floor(r / 3) &&
                Math.floor(selected.c / 3) === Math.floor(c / 3)
              )
            );

          // Número seleccionado
          const selectedValue =
            selected
              ? board[selected.r][selected.c]
              : null;

          // Resaltar todos los números iguales
          const sameNumber =
            selectedValue &&
            show === selectedValue;

          return (

            <button

              key={key}

              onClick={() => onSelect({ r, c })}

              className={`
                ${givens[r][c] ? "given" : ""}
                ${active ? "active" : ""}
                ${peer ? "peer" : ""}
                ${sameNumber ? "same" : ""}
                ${wrong ? "wrong" : ""}
              `}

            >

              {

                notes[key]?.length && !wrong

                  ?

                  <span className="notes">

                    {

                      [1,2,3,4,5,6,7,8,9].map(n =>

                        <i key={n}>

                          {notes[key].includes(n) ? n : ""}

                        </i>

                      )

                    }

                  </span>

                  :

                  show || ""

              }

            </button>

          );

        })

      )}

    </div>

  );

}