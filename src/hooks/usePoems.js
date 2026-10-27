import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { poems as defaultPoems } from "@/data/poems";

// Carica le modifiche (testo poesia + URL copertina) dal database invece che
// dal localStorage, così persistono tra sessioni e dispositivi.
// La scrittura è riservata agli admin; la lettura è pubblica.
export function usePoems() {
  const [overrides, setOverrides] = useState({}); // volume -> { id, poem, image }

  useEffect(() => {
    let active = true;
    base44.entities.PoemOverride
      .list()
      .then((records) => {
        if (!active) return;
        const map = {};
        for (const r of records) {
          map[r.volume] = { id: r.id, poem: r.poem, image: r.image };
        }
        setOverrides(map);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const merged = defaultPoems.map((p) => {
    const ov = overrides[p.volume];
    const hasOv = !!ov;
    return {
      volume: p.volume,
      poem: hasOv && ov.poem != null ? ov.poem : p.poem,
      image: hasOv && ov.image != null ? ov.image : "",
      defaultPoem: p.poem,
      edited: hasOv && ov.poem != null && ov.poem !== p.poem,
    };
  });

  const updateVolume = useCallback(
    async (volume, data) => {
      const def = defaultPoems.find((p) => p.volume === volume);
      const isDefault =
        def && (data.poem ?? def.poem) === def.poem && !data.image;
      const existing = overrides[volume];

      if (isDefault && existing) {
        await base44.entities.PoemOverride.delete(existing.id);
        setOverrides((prev) => {
          const r = { ...prev };
          delete r[volume];
          return r;
        });
        return;
      }
      if (isDefault) return;

      if (existing) {
        const updated = await base44.entities.PoemOverride.update(existing.id, data);
        setOverrides((prev) => ({
          ...prev,
          [volume]: { id: existing.id, poem: updated.poem, image: updated.image },
        }));
      } else {
        const created = await base44.entities.PoemOverride.create({ volume, ...data });
        setOverrides((prev) => ({
          ...prev,
          [volume]: { id: created.id, poem: created.poem, image: created.image },
        }));
      }
    },
    [overrides]
  );

  const resetVolume = useCallback(
    async (volume) => {
      const existing = overrides[volume];
      if (!existing) return;
      await base44.entities.PoemOverride.delete(existing.id);
      setOverrides((prev) => {
        const r = { ...prev };
        delete r[volume];
        return r;
      });
    },
    [overrides]
  );

  return { poems: merged, updateVolume, resetVolume };
}