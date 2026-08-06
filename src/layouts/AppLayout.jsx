import { NavLink, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Crown, Flame, Home, LogOut, Settings, ShoppingBag, Trophy, User } from 'lucide-react'
import { useGame } from '../context/GameContext'
import { useAuth } from '../context/AuthContext'
import StreakModal from '../components/StreakModal'
import { checkStreak } from '../utils/streak'

const links = [[Home,'Inicio','/'],[Trophy,'Ranking','/ranking'],[ShoppingBag,'Tienda','/shop'],[User,'Perfil','/profile'],[Settings,'Ajustes','/settings']]
export default function AppLayout() { 
	const { player } = useGame(); 
	const { signOut, updateProfile } = useAuth(); 
	const [showStreakModal, setShowStreakModal] = useState(false);
	useEffect(() => {

		const result = checkStreak(player);

		if (
			result.status === "missed" &&
			player.streak > 0 &&
			player.streak_shields > 0
		) {

			setShowStreakModal(true);

		}

	}, [player]);

	const useShield = async () => {
		const today = new Date()
			.toISOString()
			.slice(0, 10);
		await updateProfile({

			streak_shields:
			player.streak_shields - 1,

			last_played: today,

		});
		setShowStreakModal(false);
	};

	const loseStreak = async () => {
		const today = new Date()
			.toISOString()
			.slice(0, 10);
		await updateProfile({
			streak: 0,
			last_played: today,
		});
		setShowStreakModal(false);
	};

	return <div className="app-shell"><aside><NavLink to="/" className="brand"><span>m</span>MinDoku</NavLink><nav>{links.map(([Icon,label,to]) => <NavLink key={to} to={to} end={to === '/'}><Icon size={19}/>{label}</NavLink>)}</nav><div className="side-card"><Crown size={19}/><strong>Nivel {player.level}</strong><div className="xp"><i style={{width:`${player.xp % 100}%`}}/></div><small>{player.xp} XP total</small></div></aside><main><header><div className="mobile-brand">MinDoku</div><div className="top-stats"><span><Flame size={18}/> {player.streak} días</span><span className="coin">● {player.coins}</span><div className="avatar">{player.name[0]}</div><button className="logout" onClick={signOut}><LogOut size={17}/> Salir</button></div></header><Outlet />{showStreakModal && (

	<StreakModal
		streak={player.streak}
		shields={player.streak_shields}
		onUseShield={useShield}
		onLoseStreak={loseStreak}
	/>

	)}</main></div> }
