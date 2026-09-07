import type { PlaceDetail } from "../../../types/place-detail";
export default function PlaceInfo({ place }: { place: PlaceDetail }) {
  return (
    <>
      <section>
        <h2 className="mb-3 text-lg font-bold">Deskripsi</h2>
        {place.description.map((p) => (
          <p key={p} className="mb-3 text-sm leading-relaxed text-slate-600">
            {p}
          </p>
        ))}
      </section>
      <div className="grid gap-8 border-t pt-8 md:grid-cols-2">
        <section>
          <h2 className="mb-3 font-bold">Jam Operasional</h2>
          {place.operatingHours.map((i) => (
            <p key={i.day} className="text-sm">
              <b className="inline-block w-24">{i.day}</b>
              {i.hours}
            </p>
          ))}
        </section>
        <section>
          <h2 className="mb-3 font-bold">Fasilitas</h2>
          <div className="flex flex-wrap gap-2">
            {place.facilities.map((f) => (
              <span
                key={f}
                className="rounded-full border bg-slate-50 px-3 py-1.5 text-xs"
              >
                {f}
              </span>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
