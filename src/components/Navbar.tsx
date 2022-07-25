import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'

const NavItem = ({
  to,
  className,
  children,
}: {
  to: string
  className: string
  children: React.ReactNode
}) => {
  return (
    <Link href={to}>
      <a
        className={clsx(
          'px-5 py-3 rounded-xl font-semibold duration-100 !no-underline text-xs lg:text-sm',
          className,
        )}
      >
        {children}
      </a>
    </Link>
  )
}

export default function Navbar() {
  return (
    <header className="w-full">
      <nav className="flex child:ml-5 first:m-0 justify-end py-5 pr-5">
        <NavItem
          to="/listings"
          className="bg-white border-2 border-black !text-black hover:bg-lightGray"
        >
          Browse Listings
        </NavItem>

        <NavItem
          to="/signup"
          className="bg-orange !text-white hover:bg-darkOrange"
        >
          Sign Up / Sign In
        </NavItem>
      </nav>
    </header>
  )
}
