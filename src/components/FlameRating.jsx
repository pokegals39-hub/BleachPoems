import React, { useState } from "react";
import { Flame } from "lucide-react";

// Selettore/visualizzatore a fiamme con supporto mezze fiamme.
// - value: valore attuale (0..5, multipli di 0.5)
// - onChange: callback(opzionale) per modalità editabile
// - readOnly: true per solo visualizzazione
export default function FlameRating({ value = 0, onChange, readOnly = false, size = 28 }) {
  const [hover, setHover] = useState(0);
  const display = readOnly ? value : hover || value;

  const pickHalf = (e, i) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    return x < rect.width / 2 ? i - 0.5 : i;
  };

  return (
    <div className="flex items-center" onMouseLeave={() => !readOnly && setHover(0)}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fraction = Math.max(0, Math.min(1, display - (i - 1)));
        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            onClick={(e) => !readOnly && onChange?.(pickHalf(e, i))}
            onMouseMove={(e) => !readOnly && setHover(pickHalf(e, i))}
            className="relative leading-none"
            style={{ cursor: readOnly ? "default" : "pointer", width: size, height: size }}
            aria-label={`${i} fiamme`}
          >
            <Flame
              size={size}
              className="text-neutral-700"
              fill="currentColor"
              style={{ display: "block" }}
            />
            <span
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${fraction * size}px`, height: size }}
            >
              <Flame
                size={size}
                className="text-orange-500"
                fill="currentColor"
                style={{ display: "block" }}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}