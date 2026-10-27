import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { X, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";

export default function PoemModal({
  volume,
  poem,
  image,
  open,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onOpenChange,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft" && canPrev) onPrev();
      if (e.key === "ArrowRight" && canNext) onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, canPrev, canNext, onPrev, onNext]);

  const known = poem && poem !== "Unknown";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
        <DialogContent className="max-w-3xl border-orange-500/30 bg-neutral-950 p-0 overflow-hidden [&>button]:hidden">
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl z-0" />

                {/* frecce di navigazione */}
                {canPrev && (
                  <button
                    onClick={onPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-30 grid place-items-center w-9 h-9 rounded-full border border-neutral-800 bg-black/50 text-neutral-400 hover:text-orange-400 hover:border-orange-500/60 transition"
                    title="Volume precedente"
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}
                {canNext && (
                  <button
                    onClick={onNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-30 grid place-items-center w-9 h-9 rounded-full border border-neutral-800 bg-black/50 text-neutral-400 hover:text-orange-400 hover:border-orange-500/60 transition"
                    title="Volume successivo"
                  >
                    <ChevronRight size={18} />
                  </button>
                )}

                <div className="absolute top-4 right-4 z-30">
                  <button
                    onClick={() => onOpenChange(false)}
                    className="grid place-items-center w-8 h-8 rounded-full border border-neutral-800 bg-black/40 text-neutral-500 hover:text-orange-400 hover:border-orange-500/50 transition"
                    title="Chiudi"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row">
                  {/* COVER */}
                  <div className="relative sm:w-[42%] shrink-0 bg-gradient-to-br from-neutral-900 to-black p-6 sm:p-8 flex items-center justify-center min-h-[220px] sm:min-h-[420px]">
                    {image ? (
                      <img
                        src={image}
                        alt={`Copertina volume ${volume}`}
                        className="max-h-[200px] sm:max-h-[360px] w-auto object-contain rounded-sm shadow-[0_0_40px_rgba(255,107,26,0.15)]"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <span className="font-display text-7xl sm:text-8xl font-black text-orange-500 leading-none">
                          {volume}
                        </span>
                        <span className="mt-3 text-[10px] uppercase tracking-[0.3em] text-neutral-600">
                          Volume {volume}
                        </span>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] text-neutral-600">
                          <ImageIcon size={12} /> nessuna copertina
                        </span>
                      </div>
                    )}
                  </div>

                  {/* POEM */}
                  <div className="flex-1 px-7 py-10 sm:px-9 sm:py-12 relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="font-display text-3xl font-black text-orange-500 leading-none sm:hidden">
                        {volume}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-orange-500/60 to-transparent" />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                        Volume {volume}
                      </span>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                      {known ? (
                        <p className="whitespace-pre-line font-display text-base sm:text-lg leading-relaxed text-neutral-100">
                          {poem}
                        </p>
                      ) : (
                        <p className="py-8 text-center text-neutral-500 italic">
                          Nessuna poesia registrata per questo volume.
                        </p>
                      )}
                      <p className="mt-6 text-right text-[11px] uppercase tracking-[0.25em] text-neutral-600">
                        — Tite Kubo
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}