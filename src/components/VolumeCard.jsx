import React from "react";
import { motion } from "framer-motion";

export default function VolumeCard({ volume, poem, image, edited, index, onOpen }) {
  const preview = poem && poem !== "Unknown" ? poem.split("\n")[0].slice(0, 48) : "";
  const hasImage = !!image;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.012, 0.6) }}
      whileHover={{ y: -4 }}
      onClick={onOpen}
      className="group relative aspect-[3/4] w-full overflow-hidden rounded-sm border border-neutral-800 bg-neutral-950 text-left transition-colors hover:border-orange-500/70"
    >
      {hasImage && (
        <>
          <img
            src={image}
            alt={`Volume ${volume}`}
            className="absolute inset-0 h-full w-full object-cover opacity-80 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
        </>
      )}

      {!hasImage && (
        <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      <div className="relative flex h-full flex-col justify-between p-4">
        <div className="flex items-start justify-between">
          <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 group-hover:text-orange-500 transition-colors">
            Vol
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <span
            className={`font-display font-black leading-none transition-colors duration-300 ${
              hasImage
                ? "text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                : "text-6xl text-neutral-200 group-hover:text-orange-500"
            }`}
          >
            {volume}
          </span>
        </div>

        <div className="space-y-1">
          {preview ? (
            <p className="text-[11px] leading-snug text-neutral-300 line-clamp-2 italic">
              "{preview}{preview.length >= 48 ? "…" : ""}"
            </p>
          ) : (
            <p className="text-[11px] text-neutral-600 italic">Nessuna poesia</p>
          )}
          <span className="inline-block text-[10px] uppercase tracking-widest text-orange-500/0 group-hover:text-orange-500/80 transition-colors">
            Leggi la poesia →
          </span>
        </div>
      </div>
    </motion.button>
  );
}