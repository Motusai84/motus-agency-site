export type SalonImage = { src: string; alt: string; credit: string; source: string; caption?: string; position?: string };
export type SalonService = { id: string; name: string; description: string; price: number; duration: string };
export type SalonProduct = { id: string; name: string; category: "bundle" | "wig"; description: string; image: SalonImage; variants: { label: string; price: number }[] };
export type ClientConfig = {
  name: string;
  shortName: string;
  tagline: string;
  introduction: string;
  headline: [string, string];
  about: string;
  hero: SalonImage;
  story: SalonImage;
  care: SalonImage;
  services: SalonService[];
  featuredService: { id: string; image: SalonImage; label: string; note: string };
  products: SalonProduct[];
  gallery: SalonImage[];
  instagramUrl?: string;
};

const images = {
  afro: { src: "/images/salon-demo/afro-portrait.jpg", alt: "Black woman wearing her natural hair in a rounded afro", credit: "Kwesi Badu", source: "https://www.pexels.com/photo/portrait-of-beautiful-woman-with-afro-14650234/" },
  braids: { src: "/images/salon-demo/braids-portrait.jpg", alt: "Close-up portrait of a Black woman with braided hair", credit: "The Oluseyi", source: "https://www.pexels.com/photo/close-up-of-woman-face-18466009/" },
  protectiveBraids: { src: "/images/salon-demo/protective-braids.jpg", alt: "Black woman wearing long centre-parted box braids against a dark backdrop", credit: "Ali Drabo", source: "https://www.pexels.com/photo/woman-with-long-black-braided-hair-18909777/" },
  studio: { src: "/images/salon-demo/studio-portrait.jpg", alt: "Black woman smiling with a natural afro against a warm studio backdrop", credit: "Abel Kayode", source: "https://www.pexels.com/photo/woman-with-an-afro-hair-smiling-10850673/" },
  salon: { src: "/images/salon-demo/salon-braiding.jpg", alt: "Close-up of a stylist's hands braiding a Black woman's hair", credit: "Vurzie Kim", source: "https://www.pexels.com/photo/a-young-woman-having-her-hair-braided-15576674/" },
  curls: { src: "/images/salon-demo/natural-curls.jpg", alt: "Black woman with natural curls and hoop earrings outdoors", credit: "Luis Morales Torres", source: "https://www.pexels.com/photo/portrait-of-a-woman-outdoors-17309905/" },
  textured: { src: "/images/salon-demo/textured-portrait.jpg", alt: "Portrait of a Black woman with natural hair against a dark backdrop", credit: "Elo", source: "https://www.pexels.com/photo/portrait-of-a-woman-with-natural-hair-against-dark-background-36120417/" },
  extensionTones: { src: "/images/salon-demo/extension-tones.jpg", alt: "Blonde and brunette hair extension bundles on a soft pink backdrop", credit: "Alina Skazka", source: "https://www.pexels.com/photo/bundles-of-human-hair-14730867/" },
  extensionDetail: { src: "/images/salon-demo/extension-detail.jpg", alt: "Close-up of a brunette-to-blonde hair extension bundle", credit: "Alina Skazka", source: "https://www.pexels.com/photo/bundle-of-hair-extension-on-pink-background-14730874/" },
  brunetteWig: { src: "/images/salon-demo/brunette-wig.jpg", alt: "Straight brunette wig with a fringe displayed on a mannequin", credit: "geiger barbero", source: "https://www.pexels.com/photo/wig-on-mannequin-face-17320163/" },
  blondeWig: { src: "/images/salon-demo/blonde-wave-wig.jpg", alt: "Stylist brushing a dark-rooted blonde wig on a black display head", credit: "RDNE Stock project", source: "https://www.pexels.com/photo/woman-in-black-mask-and-black-mask-6923351/" },
} satisfies Record<string, SalonImage>;

export const salonDemo: ClientConfig = {
  name: "Crown & Coil",
  shortName: "C&C",
  tagline: "Hair studio · Wigs & bundles",
  introduction: "Curls, coils and protective styles. Thoughtful appointments, a considered collection, and room to find your own look.",
  headline: ["Your texture.", "Your crown."],
  about: "A thoughtful appointment starts with a conversation. Your texture, your routine and the look you have in mind all matter. From a wash and finish to a protective style or wig fitting, there is room to find what feels right for you.",
  hero: images.afro,
  story: images.studio,
  care: images.salon,
  featuredService: { id: "braids", image: images.protectiveBraids, label: "Protective styling", note: "Your parting. Your length. Your finish. Start with a conversation about the style you have in mind." },
  services: [
    { id: "wash-finish", name: "Wash & finish", description: "A cleanse, condition and finish shaped around your hair.", price: 55, duration: "60–90 minutes" },
    { id: "silk-press", name: "Silk press", description: "A smooth finish with movement and careful heat protection.", price: 75, duration: "90–120 minutes" },
    { id: "braids", name: "Braids & twists", description: "Choose your length, parting and finish at a consultation.", price: 95, duration: "From 2 hours" },
    { id: "conditioning", name: "Conditioning treatment", description: "Time for a wash, a conditioning treatment and a gentle finish.", price: 40, duration: "60 minutes" },
    { id: "wig-fitting", name: "Wig fitting & styling", description: "A considered fit, a finished hairline and styling to suit you.", price: 80, duration: "90 minutes" },
    { id: "extensions", name: "Extension fitting", description: "Discuss the method, length and look before your fitting.", price: 120, duration: "From 2 hours" },
  ],
  products: [
    { id: "soft-wave", name: "Soft tone bundles", category: "bundle", description: "A palette of soft blonde and brunette tones. An illustrative collection piece.", image: images.extensionTones, variants: [{ label: "14 inch", price: 85 }, { label: "18 inch", price: 110 }, { label: "22 inch", price: 140 }] },
    { id: "defined-curl", name: "Rooted blonde bundle", category: "bundle", description: "A darker root flowing into warm blonde lengths. An illustrative collection piece.", image: images.extensionDetail, variants: [{ label: "14 inch", price: 90 }, { label: "18 inch", price: 120 }, { label: "22 inch", price: 150 }] },
    { id: "everyday-curl", name: "The brunette fringe", category: "wig", description: "A straight silhouette with a full fringe. An illustrative collection piece.", image: images.brunetteWig, variants: [{ label: "16 inch", price: 195 }, { label: "20 inch", price: 225 }] },
    { id: "textured-volume", name: "The soft blonde wave", category: "wig", description: "Dark roots, soft waves and a lighter finish. An illustrative collection piece.", image: images.blondeWig, variants: [{ label: "16 inch", price: 210 }, { label: "20 inch", price: 245 }] },
  ],
  gallery: [
    { ...images.textured, caption: "Texture, in its own right.", position: "50% 35%" },
    { ...images.studio, caption: "Room to be yourself.", position: "50% 30%" },
    { ...images.salon, caption: "Care is in the details.", position: "50% 45%" },
  ],
};
