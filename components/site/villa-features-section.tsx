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
    <section className="relative overflow-hidden bg-[#faf8f5] px-6 pb-20 pt-20 sm:px-10 sm:pb-24 lg:px-16 lg:pb-36">
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
        className="relative z-0 mt-16 w-full text-balance break-words px-1 text-center text-[clamp(2.35rem,11vw,4.5rem)] font-extrabold leading-[.95] tracking-[-.055em] text-[#ebe7e1] lg:pointer-events-none lg:absolute lg:-bottom-6 lg:inset-x-5 lg:mt-0 lg:w-auto lg:whitespace-nowrap lg:px-0 lg:text-[clamp(4rem,7vw,8rem)]"
      >
        {t.facilitiesBackdrop}
      </div>
    </section>
  );
}
