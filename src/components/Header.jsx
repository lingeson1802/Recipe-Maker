import { PiBookmarkSimple, PiHeart, PiList } from "react-icons/pi";
import { Link } from "react-router-dom";

export default function Header({ toggleSidebar }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/30 border-b border-white/40 flex items-center justify-between px-4 py-4 shadow-md">
      <button onClick={toggleSidebar} className="text-2xl text-[#ED8A42]">
        <PiList />
      </button>
      <Link to="/" className="text-xl font-bold text-[#ED8A42] cursor-pointer">Recipe.now</Link>
      <div className="flex gap-4 text-2xl text-[#48b85c]">
        <Link to="/saved">
          <PiBookmarkSimple className="cursor-pointer hover:text-[#f10100]" />
        </Link>
        <Link to="/favorites">
        <PiHeart className="cursor-pointer hover:text-[#f10100]" />
        </Link>
        
      </div>
    </header>
  );
}
