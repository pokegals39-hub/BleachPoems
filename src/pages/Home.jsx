import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen } from "lucide-react";
import { usePoems } from "@/hooks/usePoems";
import VolumeCard from "@/components/VolumeCard";
import PoemModal from "@/components/PoemModal";
import FeedbackSection from "@/components/FeedbackSection";

export default function Home() {
  const { poems } = usePoems();
  const [active, setActive] = useState(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return poems;
    return poems.filter(
      (p) => String(p.volume) === q || p.poem.toLowerCase().includes(q)
    );
  }, [query, poems]);

  const openPoem = (p) => setActive(p);
  const close = () => setActive(null);

  const activeIndex = active
    ? filtered.findIndex((p) => p.volume === active.volume)
    : -1;
  const navigate = (i) => {
    if (i >= 0 && i < filtered.length) setActive(filtered[i]);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-body relative overflow-hidden">
      {/* aloni ambientali */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-5%] h-[40vh] w-[40vh] rounded-full bg-orange-600/10 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[50vh] w-[50vh] rounded-full bg-orange-500/5 blur-[140px]" />
      </div>

      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 py-12 sm:py-20">
        {/* HERO */}
        <header className="relative text-center mb-14 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.5em] text-orange-500/80 mb-5">
              Tite Kubo
            </p>
            <h1 className="font-display text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none">
              <span className="text-white">BLE</span>
              <span className="text-orange-500">ACH</span>
            </h1>
            <div className="mt-6 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-orange-500/50" />
              <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-neutral-400">
                74 Volumi · 74 Poesie
              </p>
              <span className="h-px w-12 bg-orange-500/50" />
            </div>
            <p className="mt-6 max-w-xl mx-auto text-sm sm:text-base text-neutral-500 leading-relaxed">
              I versi che aprono ogni volume. Seleziona un volume per leggere la
              sua poesia.
            </p>
          </motion.div>

        </header>

        {/* RICERCA */}
        <div className="mx-auto mb-10 max-w-md">
          <div className="flex items-center gap-3 rounded-full border border-neutral-800 bg-neutral-950/60 px-4 py-2.5 focus-within:border-orange-500/60 transition">
            <Search size={16} className="text-neutral-600" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca per numero o parole…"
              className="flex-1 bg-transparent text-sm text-neutral-200 placeholder:text-neutral-600 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-xs text-neutral-500 hover:text-orange-400"
              >
                pulisci
              </button>
            )}
          </div>
        </div>

        {/* GRIGLIA */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-neutral-600">
            <BookOpen size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nessuna poesia corrisponde alla ricerca.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4"
          >
            {filtered.map((p, i) => (
              <VolumeCard
                key={p.volume}
                volume={p.volume}
                poem={p.poem}
                image={p.image}
                edited={p.edited}
                index={i}
                onOpen={() => openPoem(p)}
              />
            ))}
          </motion.div>
        )}

        {/* FEEDBACK */}
        <FeedbackSection />

        {/* FOOTER */}
        <footer className="mt-16 border-t border-neutral-900 pt-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-600">
            Omaggio dei fan · Bleach © Tite Kubo / Shueisha
          </p>
          <div className="mt-3 space-y-1 text-[11px] text-neutral-600">
            <p>
              Fonte cover:{" "}
              <a
                href="https://comicvine.gamespot.com/bleach/4050-18244/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-orange-400 underline underline-offset-2"
              >
                comicvine.gamespot.com/bleach
              </a>
            </p>
            <p>
              Fonte Poemetti:{" "}
              <a
                href="https://it.wikiquote.org/wiki/Bleach"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-orange-400 underline underline-offset-2"
              >
                it.wikiquote.org/wiki/Bleach
              </a>
            </p>
            <p className="pt-1 text-neutral-700">
              Per correzzioni o variazioni verrà in futuro aggiunta una sezione
              feedback.
            </p>
          </div>
        </footer>
      </div>

      <PoemModal
        volume={active?.volume}
        poem={active?.poem}
        image={active?.image}
        open={!!active}
        canPrev={activeIndex > 0}
        canNext={activeIndex >= 0 && activeIndex < filtered.length - 1}
        onPrev={() => navigate(activeIndex - 1)}
        onNext={() => navigate(activeIndex + 1)}
        onOpenChange={(o) => !o && close()}
      />
    </div>
  );
}