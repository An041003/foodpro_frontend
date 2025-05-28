import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import AppRouter from './router'

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-800 ">
      <AppRouter />
    </div>
  )
}
