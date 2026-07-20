import { Eraser } from 'lucide-react'
export default function NumberPad({ onNumber, onErase, disabled }) { return <div className="number-pad">{[1,2,3,4,5,6,7,8,9].map(n=><button disabled={disabled} onClick={()=>onNumber(n)} key={n}>{n}</button>)}<button disabled={disabled} onClick={onErase} aria-label="Borrar"><Eraser size={20}/></button></div> }
