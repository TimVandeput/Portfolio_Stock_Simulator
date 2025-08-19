"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="sticky bottom-0 z-10 w-full bg-gradient-to-t from-blue-300 to-[#e0e5ec] h-18 flex items-center justify-center shadow-lg">
      <div className="flex justify-center pt-4">
        <span className="text-blue-400 font-semibold">
          &copy; Tim Vandeput {year}
        </span>
      </div>
    </footer>
  );
}
