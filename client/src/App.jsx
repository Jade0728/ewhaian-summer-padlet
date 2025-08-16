import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';

function App() {

  return (
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/' element={<Home/>}/>
      </Routes>
  )
}

export default App
