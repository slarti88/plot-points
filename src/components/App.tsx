import { useEffect, useState } from 'react'
import type { Level, LevelInfo } from '../types'
import LevelSelect from './LevelSelect'
import GameScreen from './GameScreen'

export default function App() {
  const [screen, setScreen] = useState<'select' | 'game'>('select')
  const [levels, setLevels] = useState<LevelInfo[]>([])
  const [level, setLevel] = useState<Level | null>(null)

  useEffect(() => {
    fetch('levels.json').then(r => r.json()).then(setLevels)
  }, [])

  const handleSelect = (id: string) => {
    fetch(`${id}.json`).then(r => r.json()).then((data: Level) => {
      setLevel(data)
      setScreen('game')
    })
  }

  const handleSelectLevel = () => {
    setScreen('select')
    setLevel(null)
  }

  if (screen === 'game' && level) {
    return <GameScreen level={level} onSelectLevel={handleSelectLevel} />
  }

  return <LevelSelect levels={levels} onSelect={handleSelect} />
}
