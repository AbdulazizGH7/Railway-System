import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className='bg-cyan-600 p-6 flex justify-between'>
        <h1 className='text-xl font-semibold text-gray-100'>Saudi Railway</h1>
        <ul className='flex text-lg text-gray-100 gap-5'>
            <li><Link to={"/"}>Home</Link></li>
            <li>Logout</li>
        </ul>
    </header>
  )
}

export default Navbar