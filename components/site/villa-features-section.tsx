"use client";

import {
  BedDouble,
  Bath,
  Droplets,
  Flame,
  House,
  Mountain,
  Sofa,
  Trees,
  UtensilsCrossed,
  Waves,
} from "lucide-react";

import { type Language, siteCopy } from "@/app/site-content";

const featureIcons = [
  House,
  BedDouble,
  Sofa,
  UtensilsCrossed,
  Waves,
  Droplets,
  Flame,
  Trees,
  Mountain,
  Bath,
];

export function VillaFeaturesSection({ t }: { t: (typeof siteCopy)[Language] }) {
  return (
    <section className="relative overflow-hidden bg-[#faf8f5] px-6 pb-32 pt-20 sm:px-10 md:pb-36 lg:px-16">
      <div className="relative z-10 mx-auto max-w-[1500px]">
        <div className="text-center">
          <p className="eyebrow">{t.facilitiesEyebrow}</p>
          <h2 className="section-title mx-auto mt-4 text-balance text-center">
            {t.facilitiesTitle}
          </h2>
        </div>

        <div className="mt-16 grid gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-5 lg:gap-y-14">
          {t.facilities.map(([title, description], index) => {
            const Icon = featureIcons[index];
            return (
              <article
                key={title}
                className={`px-4 text-center sm:px-7 lg:px-6 ${index % 5 !== 4 ? "lg:border-r lg:border-[#e5e0d8]" : ""}`}
              >
                <Icon strokeWidth={1.3} className="mx-auto size-11 text-[#a08f6d]" />
                <h3 className="mt-6 text-lg font-bold">{title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#77787b]">
                  {description}
                </p>
              </article>
            );
          })}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-2 inset-x-3 whitespace-nowrap text-center text-[7vw] font-extrabold tracking-[-.06em] text-[#f0ede8] sm:-bottom-4 sm:inset-x-5 lg:-bottom-6 lg:text-[clamp(4rem,7vw,8rem)]"
      >
        {t.facilitiesBackdrop}
      </div>
    </section>
  );
}
