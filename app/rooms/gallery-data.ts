export type GalleryCategory = "bedrooms" | "shared" | "outdoors";

export type LocalizedGalleryText = {
  en: string;
  de: string;
  hu: string;
  tr: string;
};

export type GalleryImage = {
  id?: string;
  src: string;
  category: GalleryCategory;
  order: number;
  room?: 1 | 2 | 3 | 4;
  alt?: LocalizedGalleryText;
  caption?: LocalizedGalleryText;
};

export const galleryImages: readonly GalleryImage[] = [
  { src: "/images/gallery/bedroom-1-01.jpg", category: "bedrooms", room: 1, order: 1 },
  { src: "/images/gallery/bedroom-1-02.jpg", category: "bedrooms", room: 1, order: 2 },
  { src: "/images/gallery/bedroom-1-03.jpg", category: "bedrooms", room: 1, order: 3 },
  { src: "/images/gallery/bedroom-1-04.jpg", category: "bedrooms", room: 1, order: 4 },
  { src: "/images/gallery/bedroom-1-05.jpg", category: "bedrooms", room: 1, order: 5 },
  { src: "/images/gallery/bedroom-2-01.jpg", category: "bedrooms", room: 2, order: 1 },
  { src: "/images/gallery/bedroom-2-02.jpg", category: "bedrooms", room: 2, order: 2 },
  { src: "/images/gallery/bedroom-2-03.jpg", category: "bedrooms", room: 2, order: 3 },
  { src: "/images/gallery/bedroom-2-04.jpg", category: "bedrooms", room: 2, order: 4 },
  { src: "/images/gallery/bedroom-2-05.jpg", category: "bedrooms", room: 2, order: 5 },
  { src: "/images/gallery/bedroom-3-01.jpg", category: "bedrooms", room: 3, order: 1 },
  { src: "/images/gallery/bedroom-4-01.jpg", category: "bedrooms", room: 4, order: 1 },
  { src: "/images/gallery/bedroom-4-02.jpg", category: "bedrooms", room: 4, order: 2 },
  { src: "/images/gallery/bedroom-4-03.jpg", category: "bedrooms", room: 4, order: 3 },
  { src: "/images/gallery/shared-01.jpg", category: "shared", order: 1 },
  { src: "/images/gallery/shared-02.jpg", category: "shared", order: 2 },
  { src: "/images/gallery/shared-03.jpg", category: "shared", order: 3 },
  { src: "/images/gallery/shared-04.jpg", category: "shared", order: 4 },
  { src: "/images/gallery/shared-05.jpg", category: "shared", order: 5 },
  { src: "/images/gallery/shared-06.jpg", category: "shared", order: 6 },
  { src: "/images/gallery/shared-07.jpg", category: "shared", order: 7 },
  { src: "/images/gallery/shared-08.jpg", category: "shared", order: 8 },
  { src: "/images/gallery/shared-09.jpg", category: "shared", order: 9 },
  { src: "/images/gallery/shared-10.jpg", category: "shared", order: 10 },
  { src: "/images/gallery/shared-11.jpg", category: "shared", order: 11 },
  { src: "/images/gallery/shared-12.jpg", category: "shared", order: 12 },
  { src: "/images/gallery/shared-13.jpg", category: "shared", order: 13 },
  { src: "/images/gallery/shared-14.jpg", category: "shared", order: 14 },
  { src: "/images/gallery/shared-15.jpg", category: "shared", order: 15 },
  { src: "/images/gallery/outdoor-01.jpg", category: "outdoors", order: 1 },
  { src: "/images/gallery/outdoor-02.jpg", category: "outdoors", order: 2 },
  { src: "/images/gallery/outdoor-03.jpg", category: "outdoors", order: 3 },
  { src: "/images/gallery/outdoor-04.jpg", category: "outdoors", order: 4 },
  { src: "/images/gallery/outdoor-05.jpg", category: "outdoors", order: 5 },
  { src: "/images/gallery/outdoor-06.jpg", category: "outdoors", order: 6 },
  { src: "/images/gallery/outdoor-07.jpg", category: "outdoors", order: 7 },
  { src: "/images/gallery/outdoor-08.jpg", category: "outdoors", order: 8 },
  { src: "/images/gallery/outdoor-09.jpg", category: "outdoors", order: 9 },
];
