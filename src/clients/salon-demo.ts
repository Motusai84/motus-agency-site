export type SalonImage = { src: string; alt: string; credit: string; source: string };
export type SalonService = { id: string; name: string; description: string; price: number; duration: string };
export type SalonProduct = { id: string; name: string; category: "bundle" | "wig"; description: string; image: SalonImage; variants: { label: string; price: number }[] };
export type ClientConfig = {
  name: string;
  shortName: string;
  tagline: string;
  introduction: string;
  about: string;
  hero: SalonImage;
  story: SalonImage;
  care: SalonImage;
  services: SalonService[];
  products: SalonProduct[];
  gallery: SalonImage[];
  instagramUrl?: string;
};

const images = {
  afro: { src: "/images/salon-demo/afro-portrait.jpg", alt: "Black woman wearing her natural hair in a rounded afro", credit: "Kwesi Badu", source: "https://www.pexels.com/photo/portrait-of-beautiful-woman-with-afro-14650234/" },
  braids: { src: "/images/salon-demo/braids-portrait.jpg", alt: "Close-up portrait of a Black woman with braided hair", credit: "The Oluseyi", source: "https://www.pexels.com/photo/close-up-of-woman-face-18466009/" },
  studio: { src: "/images/salon-demo/studio-portrait.jpg", alt: "Black woman smiling with a natural afro against a warm studio backdrop", credit: "Abel Kayode", source: "https://www.pexels.com/photo/woman-with-an-afro-hair-smiling-10850673/" },
  salon: { src: "/images/salon-demo/salon-braiding.jpg", alt: "Close-up of a stylist's hands braiding a Black woman's hair", credit: "Vurzie Kim", source: "https://www.pexels.com/photo/a-young-woman-having-her-hair-braided-15576674/" },
  curls: { src: "/images/salon-demo/natural-curls.jpg", alt: "Black woman with natural curls and hoop earrings outdoors", credit: "Luis Morales Torres", source: "https://www.pexels.com/photo/portrait-of-a-woman-outdoors-17309905/" },
  textured: { src: "/images/salon-demo/textured-portrait.jpg", alt: "Portrait of a Black woman with natural hair against a dark backdrop", credit: "Elo", source: "https://www.pexels.com/photo/portrait-of-a-woman-with-natural-hair-against-dark-background-36120417/" },
} satisfies Record<string, SalonImage>;

export const salonDemo: ClientConfig = {
  name: "Crown & Coil",
  shortName: "C&C",
  tagline: "Hair studio · Wigs & bundles",
  introduction: "Care for your curls. A new look, made yours. Explore our services, find your inspiration and make time for your hair.",
  about: "A thoughtful appointment starts with a conversation. Your texture, your routine and the look you have in mind all matter. From a wash and finish to a protective style or wig fitting, there is room to find what feels right for you.",
  hero: images.afro,
  story: images.studio,
  care: images.salon,
  services: [
    { id: "wash-finish", name: "Wash & finish", description: "A cleanse, condition and finish shaped around your hair.", price: 55, duration: "60–90 minutes" },
    { id: "silk-press", name: "Silk press", description: "A smooth finish with movement and careful heat protection.", price: 75, duration: "90–120 minutes" },
    { id: "braids", name: "Braids & twists", description: "Choose your length, parting and finish at a consultation.", price: 95, duration: "From 2 hours" },
    { id: "conditioning", name: "Conditioning treatment", description: "Time for a wash, a conditioning treatment and a gentle finish.", price: 40, duration: "60 minutes" },
    { id: "wig-fitting", name: "Wig fitting & styling", description: "A considered fit, a finished hairline and styling to suit you.", price: 80, duration: "90 minutes" },
    { id: "extensions", name: "Extension fitting", description: "Discuss the method, length and look before your fitting.", price: 120, duration: "From 2 hours" },
  ],
  products: [
    { id: "soft-wave", name: "Soft wave bundle", category: "bundle", description: "An example of a soft, flowing texture in the collection.", image: images.curls, variants: [{ label: "14 inch", price: 85 }, { label: "18 inch", price: 110 }, { label: "22 inch", price: 140 }] },
    { id: "defined-curl", name: "Defined curl bundle", category: "bundle", description: "An example bundle for a fuller, textured look.", image: images.textured, variants: [{ label: "14 inch", price: 90 }, { label: "18 inch", price: 120 }, { label: "22 inch", price: 150 }] },
    { id: "natural-texture", name: "Natural texture bundle", category: "bundle", description: "An example texture with body and natural movement.", image: images.afro, variants: [{ label: "14 inch", price: 95 }, { label: "18 inch", price: 125 }, { label: "22 inch", price: 155 }] },
    { id: "everyday-curl", name: "Everyday curl wig", category: "wig", description: "An example ready-to-style piece with a soft curl finish.", image: images.studio, variants: [{ label: "16 inch", price: 195 }, { label: "20 inch", price: 225 }] },
    { id: "textured-volume", name: "Textured volume wig", category: "wig", description: "An example piece for a full, textured silhouette.", image: images.textured, variants: [{ label: "16 inch", price: 210 }, { label: "20 inch", price: 245 }] },
    { id: "soft-curl", name: "Soft curl wig", category: "wig", description: "An example piece with an easy, relaxed curl pattern.", image: images.curls, variants: [{ label: "16 inch", price: 185 }, { label: "20 inch", price: 220 }] },
  ],
  gallery: [images.textured, images.braids, images.curls, images.studio],
};
