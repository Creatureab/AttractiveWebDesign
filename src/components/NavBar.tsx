"use client"
import Image from "next/image"
import Link from "next/link"

const NavBar = () => {
  return (
    <header>
      <nav>
        <Link href='/' className="logo">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />

          <p>DevEvent</p>
        </Link>
        <ul>
          <Link href="/">home</Link>
          <Link href="/create-event">Create Event</Link>

        </ul>
      </nav>
    </header>
  )
}

export default NavBar