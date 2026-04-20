import Image from "next/image";

const genreIcons = {
  cyberpunk: { icon: "bolt", color: "text-cyan-400" },
  dark_romance: { icon: "favorite", color: "text-pink-500" },
  vintage_noir: { icon: "visibility_off", color: "text-slate-400" },
  space_opera: { icon: "rocket_launch", color: "text-indigo-400" },
  gothic_horror: { icon: "skull", color: "text-red-500" },
  mystery: { icon: "search", color: "text-yellow-400" },
  fantasy: { icon: "auto_awesome", color: "text-purple-400" },
  sci_fi: { icon: "psychology", color: "text-blue-400" },
  thriller: { icon: "warning", color: "text-orange-400" },

  drama: { icon: "theater_comedy", color: "text-rose-400" },
  fiction: { icon: "menu_book", color: "text-emerald-400" },
  non_fiction: { icon: "library_books", color: "text-green-300" },
  romance: { icon: "favorite_border", color: "text-pink-400" },
  horror: { icon: "mood_bad", color: "text-red-600" },
  adventure: { icon: "explore", color: "text-amber-400" },
  biography: { icon: "person", color: "text-sky-400" },
  history: { icon: "account_balance", color: "text-stone-300" },
  poetry: { icon: "draw", color: "text-fuchsia-400" },
  comedy: { icon: "sentiment_very_satisfied", color: "text-yellow-300" },
  dystopian: { icon: "location_city", color: "text-gray-400" },
  crime: { icon: "gavel", color: "text-red-400" },
  philosophical: { icon: "lightbulb", color: "text-lime-300" },
  supernatural: { icon: "visibility", color: "text-violet-400" },
  mystery_thriller: { icon: "travel_explore", color: "text-yellow-500" },
  self_help: { icon: "self_improvement", color: "text-green-400" },

  default: { icon: "book", color: "text-slate-400" },
};

const getIcon = (g) => genreIcons[g] || genreIcons.default;

export default function MysteryBook({ book }) {
  return (
    <div className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-800 hover:border-primary/40 transition-all duration-500">
      <div className="absolute inset-0 scale-110">
        <Image
          src={
            book.image_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title)}`
          }
          alt="mystery"
          fill
          className="object-cover blur-[8px] brightness-95 saturate-95 scale-105 group-hover:scale-110 transition-all duration-700"
        />
      </div>

      <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/10 to-transparent opacity-70" />

      <div className="relative h-full px-5 py-5 flex flex-col justify-between z-10">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-black uppercase px-2 py-1 bg-yellow-400 text-black rounded tracking-widest">
            Mystery
          </span>

          <span className="text-[15px] font-bold text-black flex items-center gap-1">
            ⏳ Hidden
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {book.genre_tags?.map((g, i) => {
              const data = getIcon(g);

              return (
                <span
                  key={i}
                  className="text-[11px] px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-100 flex items-center gap-1 backdrop-blur-md"
                >
                  <span
                    className={`material-symbols-outlined text-[14px] ${data.color}`}
                  >
                    {data.icon}
                  </span>
                  {g.replaceAll("_", " ")}
                </span>
              );
            })}
          </div>

          <p className="text-[12px] uppercase tracking-[0.35em] text-primary font-semibold">
            {book.author}
          </p>

          <p className="text-[13px] text-slate-200 italic leading-relaxed line-clamp-2 font-medium">
            {book.description}
          </p>
        </div>

        <button className="mt-4 mx-2 w-[calc(100%-16px)] bg-gradient-to-r from-[#e42c0c] to-[#e4aa0a] text-white font-normal py-3 rounded-lg text-[11px] uppercase tracking-[0.25em] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
          Swap Instantly
        </button>
      </div>
    </div>
  );
}
