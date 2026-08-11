import {
  Check,
  CircleHelp,
  Palette,
  Shield,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import { useGame } from '../context/GameContext'

const products = [
  {
    id: 'shield',
    icon: Shield,
    name: 'Escudo de racha',
    text: 'Protege tu racha si un día no puedes jugar.',
    cost: 200,
  },
  {
    id: 'hint',
    icon: CircleHelp,
    name: 'Pista extra',
    text: 'Revela una casilla cuando la necesites.',
    cost: 70,
  },
  {
    id: 'mint',
    icon: Palette,
    name: 'Tema menta',
    text: 'Un tablero fresco para tus partidas.',
    cost: 180,
  },
  {
    id: 'frame',
    icon: Sparkles,
    name: 'Marco aurora',
    text: 'Un borde especial para tu perfil.',
    cost: 320,
  },
]

export default function ShopPage() {

  const { player, spend } = useGame()

  const [owned, setOwned] = useState([])

  const buy = (item) => {

    if (item.id === 'shield') {

      if (player.coins < item.cost) {
        return
      }

      if (spend(item.cost)) {
        // El escudo no se guarda como "comprado".
        // Se suma directamente a los disponibles.
        // La actualización real se hace en el perfil.
      }

      return
    }

    if (owned.includes(item.id)) {
      return
    }

    if (spend(item.cost)) {
      setOwned((list) => [
        ...list,
        item.id,
      ])
    }
  }

  return (
    <section className="module-page">

      {/* HEADER */}

      <div className="module-hero">

        <div>

          <p className="eyebrow">
            PERSONALIZA TU EXPERIENCIA
          </p>

          <h1>Tienda</h1>

          <p>
            Usa las monedas que ganas jugando
            para desbloquear detalles únicos.
          </p>

        </div>

        <span className="shop-balance">
          ● {player.coins}
        </span>

      </div>

      {/* PRODUCTOS */}

      <div className="shop-grid-new">

        {products.map((item) => {

          const Icon = item.icon

          const has =
            item.id !== 'shield' &&
            owned.includes(item.id)

          const canBuy =
            player.coins >= item.cost

          return (

            <article
              key={item.id}
              className="shop-item"
            >

              <div className="shop-icon">
                <Icon />
              </div>

              <h2>
                {item.name}
              </h2>

              <p>
                {item.text}
              </p>

              {/* INFORMACIÓN DEL ESCUDO */}

              {item.id === 'shield' && (

                <div className="shield-stock">

                  🛡️ Disponibles: {
                    player.streak_shields || 0
                  }

                </div>

              )}

              {/* PRECIO */}

              <button
                onClick={() => buy(item)}
                disabled={has || !canBuy}
                className={!canBuy && !has ? 'shop-buy-disabled' : ''}
              >
                {has ? (
                  <>
                    <Check size={16} />
                    Obtenido
                  </>
                ) : (
                  <>
                    {item.cost} monedas
                  </>
                )}
              </button>
              
              {!canBuy && !has && (
                <div className="insufficient-money">
                  No tienes suficientes monedas
                </div>
              )}

              )}

            </article>

          )
        })}

      </div>

    </section>
  )
}
