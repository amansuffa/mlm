import { doLogout } from '@/app/actions'
import React from 'react'

const Logout = () => {
  return (
    <form action={doLogout}>
      <button
        type="submit"
        className="px-4 py-2 rounded-md bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-medium shadow hover:shadow-[inset_0_4px_6px_rgba(0,0,0,0.2)] transform hover:scale-102 transition"
      >
        Logout
      </button>
    </form>
  )
}

export default Logout
