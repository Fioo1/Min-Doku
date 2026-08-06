import { Check, CircleHelp, Palette, Sparkles } from 'lucide-react'
import { Shield } from 'lucide-react'
import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { useAuth } from '../context/AuthContext'

const products=[
	{
		id: "shield",
		icon: Shield,
		name: "Escudo de racha",
		text: "Protege tu racha si un día no puedes jugar.",
		cost: 200,
	},

	{
		id: "hint",
		icon: CircleHelp,
		name: "Pista extra",
		text: "Revela una casilla cuando la necesites.",
		cost: 70,
	},

	{
		id: "mint",
		icon: Palette,
		name: "Tema menta",
		text: "Un tablero fresco para tus partidas.",
		cost: 180,
	},

	{
		id: "frame",
		icon: Sparkles,
		name: "Marco aurora",
		text: "Un borde especial para tu perfil.",
		cost: 320,
	},
];

export default function ShopPage(){
	const { player, spend } = useGame();
	const { updateProfile } = useAuth();
	const [owned,setOwned]=useState([]);
	const buy = async (item) => {

		if (item.id === "shield") {

			if (!spend(item.cost)) return;

			await updateProfile({
			streak_shields: player.streak_shields + 1,
			});

			return;
		}

		if (owned.includes(item.id)) return;

		if (spend(item.cost)) {
			setOwned(list => [...list, item.id]);
		}

	};

return <section className="module-page"><div className="module-hero"><div><p className="eyebrow">PERSONALIZA TU EXPERIENCIA</p><h1>Tienda</h1><p>Usa las monedas que ganas jugando para desbloquear detalles únicos.</p></div><span className="shop-balance">● {player.coins}</span></div><div className="shop-grid-new">{products.map(item=>{const Icon=item.icon,has=owned.includes(item.id);return <article key={item.id} className="shop-item"><div className="shop-icon"><Icon/></div><h2>{item.name}</h2><p>{item.text}</p>
{item.id === "shield" ? (

  <>

    <p
      style={{
        marginTop: "12px",
        marginBottom: "10px",
        color: "#666",
        fontWeight: "600",
      }}
    >
      🛡️ Disponibles: {player.streak_shields}
    </p>

    <button
		onClick={() => buy(item)}
		disabled={player.coins < item.cost}
		style={{
			opacity: player.coins < item.cost ? 0.45 : 1,
			cursor: player.coins < item.cost ? "not-allowed" : "pointer",
		}}
	>
		{player.coins < item.cost
			? "Monedas insuficientes"
			: `${item.cost} monedas`}
	</button>

  </>

) : (

  <button
    onClick={() => buy(item)}
    disabled={has || player.coins < item.cost}
  >
    {has ? (
      <>
        <Check size={16}/>
        Obtenido
      </>
    ) : (
      `${item.cost} monedas`
    )}
  </button>

)}</article>})}</div></section>}
