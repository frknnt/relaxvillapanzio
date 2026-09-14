import type { ReactNode } from "react";

type PageHeroProps = {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  intro: string;
  align?: "left" | "center";
  children?: ReactNode;
};

export function PageHero({
  image,
  imageAlt,
  eyebrow,
  title,
  intro,
  align = "left",
  children,
}: PageHeroProps) {
  return (
    <section className="relative flex min-h-[620px] items-end overflow-hidden px-6 pb-20 pt-48 text-white sm:px-10 md:min-h-[700px] md:pb-28 lg:px-16">
      <img src={image} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,20,23,.62)_0%,rgba(18,20,23,.22)_42%,rgba(14,16,19,.82)_100%)]" />
      <div
        className={`relative mx-auto w-full max-w-[1500px] ${
          align === "center" ? "text-center" : ""
        }`}
      >
        <div className={align === "center" ? "mx-auto max-w-5xl" : "max-w-4xl"}>
          <p className="eyebrow !text-[#decba5]">{eyebrow}</p>
          <h1 className="mt-5 text-balance text-[clamp(2.7rem,6.2vw,6.7rem)] font-extrabold uppercase leading-[.94] tracking-[-.055em]">
            {title}
          </h1>
          <p
            className={`mt-7 text-balance text-base leading-7 text-white/78 md:text-xl md:leading-8 ${
              align === "center" ? "mx-auto max-w-3xl" : "max-w-2xl"
            }`}
          >
            {intro}
          </p>
          {children}
        </div>
      </div>
    </section>
  );
}
