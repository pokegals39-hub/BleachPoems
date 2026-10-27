import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { MessageSquare, Send, Loader2, Flame } from "lucide-react";
import FlameRating from "@/components/FlameRating";

export default function FeedbackSection() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { items } = await base44.entities.Feedback.filter(
        {},
        { sort: "-created_date", limit: 50 }
      );
      setReviews(items);
    } catch (e) {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    setError("");
    const trimmed = comment.trim();
    if (!trimmed) {
      setError("Lascia un commento per inviare la recensione.");
      return;
    }
    setSubmitting(true);
    try {
      await base44.entities.Feedback.create({ rating: rating || 0, comment: trimmed });
      setComment("");
      setRating(0);
      setOpen(false);
      load();
    } catch (e) {
      setError("Invio non riuscito. Riprova.");
    } finally {
      setSubmitting(false);
    }
  };

  const rated = reviews.filter((r) => r.rating > 0);
  const avg =
    rated.length > 0
      ? rated.reduce((s, r) => s + r.rating, 0) / rated.length
      : 0;

  return (
    <div className="mt-10">
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950/60 px-5 py-2.5 text-sm text-neutral-300 hover:text-orange-400 hover:border-orange-500/60 transition"
        >
          <MessageSquare size={15} />
          {open ? "Chiudi feedback" : "Lascia un feedback"}
        </button>

        {rated.length > 0 && !open && (
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Flame size={14} className="text-orange-500" fill="currentColor" />
            <span className="text-neutral-300 font-medium">{avg.toFixed(1)}</span>
            <span>·</span>
            <span>{rated.length} recensioni</span>
          </div>
        )}
      </div>

      {open && (
        <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 sm:p-8">
          {/* FORM */}
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-orange-500">
                Valutazione (opzionale)
              </p>
              <FlameRating value={rating} onChange={setRating} size={30} />
            </div>

            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-orange-500">
                Commento
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Scrivi la tua recensione…"
                className="w-full resize-none rounded-md border border-neutral-800 bg-black/60 p-3 text-sm leading-relaxed text-neutral-100 outline-none focus:border-orange-500/60"
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              onClick={submit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-orange-400 transition disabled:opacity-60"
            >
              {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              {submitting ? "Invio…" : "Invia recensione"}
            </button>
          </div>

          {/* LISTA RECENSIONI */}
          <div className="mt-8 border-t border-neutral-900 pt-6">
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              Recensioni ({reviews.length})
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-8 text-neutral-600">
                <Loader2 size={18} className="animate-spin" />
              </div>
            ) : reviews.length === 0 ? (
              <p className="py-6 text-center text-sm text-neutral-600 italic">
                Nessuna recensione ancora. Sii il primo!
              </p>
            ) : (
              <div className="space-y-5 max-h-80 overflow-y-auto pr-1">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-lg border border-neutral-900 bg-black/40 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <FlameRating value={r.rating || 0} readOnly size={16} />
                      <span className="text-[10px] text-neutral-600">
                        {new Date(r.created_date).toLocaleDateString("it-IT", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-200">
                      {r.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}