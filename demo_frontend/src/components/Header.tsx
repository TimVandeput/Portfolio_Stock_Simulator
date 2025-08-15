"use client";

import Link from "next/link";

const navItems = [
  { name: "Game", href: "/game" },
  { name: "A.I.", href: "/ai" },
  { name: "About", href: "/about" },
];

export default function Header() {
  return (
    <header className="sticky top-0 bg-gradient-to-b from-blue-200 to-[#e0e5ec] z-50 w-full py-4 px-0">
      <nav className="flex justify-center gap-6">
        {navItems.map((item) => (
          <Link href={item.href} key={item.name} className="no-underline">
            <button
              className="
                p-3
                rounded-xl
                font-bold
                bg-[#e0e5ec]
                text-blue-300
                shadow-[6px_6px_10px_#c2c8d0,-5px_-5px_10px_#ffffff]
                transition
                hover:bg-blue-100
              "
            >
              {item.name}
            </button>
          </Link>
        ))}
      </nav>
    </header>
  );
}
