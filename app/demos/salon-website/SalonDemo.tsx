"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { salonDemo, type ClientConfig, type SalonImage } from "@/src/clients/salon-demo";
import styles from "./salon-site.module.css";

const client: ClientConfig = salonDemo;
const money = (amount: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(amount);
const links = [["about", "The studio"], ["services", "Services"], ["products", "Collection"], ["care", "Hair care"], ["gallery", "Gallery"]];
type BagItem = { key: string; productId: string; name: string; variant: string; price: number; quantity: number; image: SalonImage };
type Modal = "booking" | "bag" | "enquiry" | "gallery" | null;

export default function SalonDemo() {
  const site = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [filter, setFilter] = useState<"all" | "bundle" | "wig">("all");
  const [variants, setVariants] = useState<Record<string, number>>({});
  const [bag, setBag] = useState<BagItem[]>([]);
  const [service, setService] = useState(client.services[0].id);
  const [day, setDay] = useState("Tuesday");
  const [time, setTime] = useState("10:00");
  const [topic, setTopic] = useState("Choosing a service");
  const [done, setDone] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [galleryImage, setGalleryImage] = useState(client.gallery[0]);
  const bagCount = bag.reduce((sum, item) => sum + item.quantity, 0);
  const bagTotal = bag.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const chosenService = client.services.find((item) => item.id === service) ?? client.services[0];
  const filtered = client.products.filter((item) => filter === "all" || item.category === filter);

  useEffect(() => {
    const root = site.current;
    if (!root) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    let observer: IntersectionObserver | undefined;
    const revealAll = () => { elements.forEach((element) => { element.dataset.revealed = "true"; }); delete root.dataset.motion; observer?.disconnect(); };
    if (media.matches || !("IntersectionObserver" in window)) revealAll();
    else {
      root.dataset.motion = "ready";
      observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) { (entry.target as HTMLElement).dataset.revealed = "true"; observer?.unobserve(entry.target); }
      }), { threshold: 0.08 });
      elements.forEach((element) => observer?.observe(element));
    }
    const handlePreference = () => { if (media.matches) revealAll(); };
    const handleFocus = (event: FocusEvent) => {
      const element = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>("[data-reveal]") : null;
      if (element) element.dataset.revealed = "true";
    };
    media.addEventListener("change", handlePreference);
    root.addEventListener("focusin", handleFocus);
    return () => { observer?.disconnect(); delete root.dataset.motion; media.removeEventListener("change", handlePreference); root.removeEventListener("focusin", handleFocus); };
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (modal && !element.open) element.showModal();
    if (!modal && element.open) element.close();
    if (!modal) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [modal]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenuOpen(false); menuTrigger.current?.focus(); } };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  const openModal = (kind: Modal) => { setDone(false); setMenuOpen(false); setModal(kind); };
  const book = (id?: string) => { if (id) setService(id); openModal("booking"); };
  const addProduct = (productId: string) => {
    const product = client.products.find((item) => item.id === productId);
    if (!product) return;
    const variant = product.variants[variants[productId] ?? 0];
    const key = `${product.id}-${variant.label}`;
    setBag((current) => {
      const existing = current.find((item) => item.key === key);
      return existing ? current.map((item) => item.key === key ? { ...item, quantity: Math.min(item.quantity + 1, 10) } : item) : [...current, { key, productId, name: product.name, variant: variant.label, price: variant.price, quantity: 1, image: product.image }];
    });
    setAnnouncement(`${product.name}, ${variant.label}, added to your demo bag.`);
  };
  const preview = (event: FormEvent) => { event.preventDefault(); setDone(true); };

  return (
    <main ref={site} className={styles.site} id="salon-top">
      <a id="salon-skip-link" className={styles.skipLink} href="#salon-main">Skip to main content</a>
      <div className={styles.demoBar}><Link id="salon-back-to-motus" href="/#examples">← Back to Motus</Link><span><strong>Website demo</strong><span className={styles.demoBarDetail}> · Fictional studio. Nothing is booked or sent.</span></span></div>
      <header className={styles.nav}>
        <a id="salon-home-link" className={styles.wordmark} href="#salon-top" aria-label={`${client.name} demo home`}><span className={styles.monogram}>{client.shortName}</span><span><strong>{client.name}</strong><small>Hair studio</small></span></a>
        <nav className={styles.desktopNav} aria-label="Salon navigation">{links.map(([id, label]) => <a id={`salon-nav-${id}`} href={`#salon-${id}`} key={id}>{label}</a>)}</nav>
        <div className={styles.navActions}>
          <button id="salon-enquiry-button" className={styles.enquireLink} type="button" onClick={() => openModal("enquiry")}>Enquire</button>
          <button id="salon-bag-button" className={styles.cartButton} type="button" onClick={() => openModal("bag")} aria-label={`Open demo bag, ${bagCount} items`}>Bag <span>{bagCount}</span></button>
          <button id="salon-book-nav" className={`${styles.actionButton} ${styles.redButton}`} type="button" onClick={() => book()}>Book a visit</button>
          <button ref={menuTrigger} id="salon-menu-button" className={styles.menuButton} type="button" aria-expanded={menuOpen} aria-controls="salon-mobile-menu" onClick={() => setMenuOpen(!menuOpen)}><span aria-hidden="true">{menuOpen ? "×" : "☰"}</span><span className={styles.srOnly}>{menuOpen ? "Close menu" : "Open menu"}</span></button>
        </div>
        <nav id="salon-mobile-menu" className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ""}`} aria-label="Salon mobile navigation" aria-hidden={!menuOpen} inert={!menuOpen}>{links.map(([id, label]) => <a id={`salon-mobile-${id}`} href={`#salon-${id}`} key={id} onClick={() => setMenuOpen(false)}>{label}</a>)}<button id="salon-mobile-enquiry" type="button" onClick={() => openModal("enquiry")}>Try an enquiry</button></nav>
      </header>

      <section className={styles.hero} id="salon-main" aria-labelledby="salon-title" tabIndex={-1}>
        <div className={styles.heroMedia}><Image src={client.hero.src} alt={client.hero.alt} fill sizes="(max-width: 700px) 100vw, 65vw" priority unoptimized /></div>
        <span className={styles.heroWord} aria-hidden="true">{client.name.split(" & ")[0]}</span><span className={styles.heroRail} aria-hidden="true">Curls · Coils · Confidence</span>
        <div className={styles.heroContent}><div className={styles.heroMeta}><p className={styles.heroKicker}>{client.tagline}</p></div><h1 id="salon-title"><span>Your hair.</span><span>Your <em>crown.</em></span><span>Your way.</span></h1><p className={styles.heroCopy}>{client.introduction}</p><div className={styles.heroActions}><button id="salon-book-hero" className={`${styles.actionButton} ${styles.redButton}`} type="button" onClick={() => book()}>Find your appointment</button><a id="salon-shop-hero" className={`${styles.actionButton} ${styles.outlineButton}`} href="#salon-products">Explore the collection →</a></div><p className={styles.heroDemoNote}>A fictional salon website, made by Motus.</p></div>
      </section>

      <div className={styles.qualities} aria-label="The studio approach"><span>Natural texture</span><span>Considered care</span><span>Wigs & bundles</span><span>Your own style</span></div>
      <section className={`${styles.section} ${styles.about}`} id="salon-about">
        <div className={styles.aboutCopy} data-reveal><p className={styles.eyebrow}>The studio</p><h2>A little time.<br /><em>Just for you.</em></h2><p>{client.about}</p><button id="salon-book-about" className={`${styles.actionButton} ${styles.redButton}`} type="button" onClick={() => book()}>Choose a service</button><p className={styles.smallNote}>{client.name} is an illustrative business. The photographs are stock imagery, rather than client work.</p></div>
        <figure className={styles.aboutImage} data-reveal="image"><Image src={client.story.src} alt={client.story.alt} width={1000} height={1000} sizes="(max-width: 700px) 100vw, 50vw" unoptimized /><figcaption>Room to feel like yourself.</figcaption></figure>
      </section>

      <section className={`${styles.section} ${styles.services}`} id="salon-services"><div className={styles.sectionHeading} data-reveal><div><p className={styles.eyebrow}>Make time for your hair</p><h2>The <em>services.</em></h2></div><p>Find your service, choose a day and try the booking preview. Prices and appointment times are examples.</p></div><div className={styles.serviceGrid} data-reveal>{client.services.map((item) => <article className={styles.serviceCard} key={item.id}><h3>{item.name}</h3><p>{item.description}</p><div><span>{item.duration}</span><strong>From {money(item.price)}</strong></div><button id={`salon-book-${item.id}`} type="button" onClick={() => book(item.id)}>Choose this service <span aria-hidden="true">→</span></button></article>)}</div><p className={styles.sectionNote}>Demo prices only. No appointment is reserved and no payment is taken.</p></section>

      <section className={`${styles.section} ${styles.products}`} id="salon-products"><div className={styles.sectionHeading} data-reveal><div><p className={styles.eyebrow}>Find your next look</p><h2>The <em>collection.</em></h2></div><p>Try the filters, choose a length and add a piece to your demo bag. Stock photographs show style inspiration, not the actual products.</p></div><div className={styles.filters} data-filter={filter} role="group" aria-label="Filter the demo collection">{(["bundle", "wig", "all"] as const).map((item) => <button id={`salon-filter-${item}`} key={item} className={filter === item ? styles.filterActive : ""} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}>{item === "bundle" ? "Bundles" : item === "wig" ? "Wigs" : "All pieces"}</button>)}</div><p className={styles.srOnly} role="status">{filtered.length} example products shown</p><div className={styles.productGrid} key={filter}>{filtered.map((product) => {
        const variant = product.variants[variants[product.id] ?? 0];
        return <article className={styles.productCard} key={product.id}><div className={styles.productImage}><Image src={product.image.src} alt={`${product.image.alt}. Style inspiration only.`} width={1000} height={1250} sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 30vw" unoptimized /></div><div className={styles.productBody}><div className={styles.productMeta}><p className={styles.productType}>{product.category === "bundle" ? "Bundle" : "Wig"} · Example piece</p></div><h3>{product.name}</h3><p>{product.description}</p><label className={styles.variantSelect} htmlFor={`salon-length-${product.id}`}><span>Length</span><select id={`salon-length-${product.id}`} value={variants[product.id] ?? 0} onChange={(event) => setVariants((current) => ({ ...current, [product.id]: Number(event.target.value) }))}>{product.variants.map((item, index) => <option key={item.label} value={index}>{item.label} — {money(item.price)}</option>)}</select></label><div className={styles.productBuy}><strong>{money(variant.price)}</strong><button id={`salon-add-${product.id}`} type="button" onClick={() => addProduct(product.id)}>Add to bag <span aria-hidden="true">+</span></button></div></div></article>;
      })}</div><div className={styles.bagFeedback}><p role="status">{announcement || "Explore a piece, then see how a product enquiry could work."}</p><button id="salon-view-bag" type="button" onClick={() => openModal("bag")}>View your bag ({bagCount}) →</button></div></section>

      <section className={`${styles.section} ${styles.nano}`} id="salon-care"><div className={styles.nanoImage} data-reveal="image"><Image src={client.care.src} alt={client.care.alt} width={1200} height={1600} sizes="(max-width: 700px) 100vw, 50vw" unoptimized /></div><div className={styles.nanoCopy} data-reveal><p className={styles.eyebrow}>Care before everything</p><h2>Good hair days.<br /><em>Your own routine.</em></h2><p>Start with what your hair needs and how you like to wear it. A conversation can help you choose a service and plan your next appointment.</p><ul><li><strong>Your texture</strong><span>Time to talk about your curls, coils and preferred finish.</span></li><li><strong>Your everyday routine</strong><span>Choose care that fits the time you have at home.</span></li><li><strong>Your next look</strong><span>Discuss a protective style, a fitting or a change of pace.</span></li></ul><button id="salon-book-care" className={`${styles.actionButton} ${styles.redButton}`} type="button" onClick={() => book("conditioning")}>Explore a care appointment →</button></div></section>

      <section className={styles.gallerySection} id="salon-gallery"><div className={styles.sectionHeading} data-reveal><div><p className={styles.eyebrow}>A little inspiration</p><h2>Every texture.<br /><em>Every kind of you.</em></h2></div><p>Stock photography celebrating Black women and natural texture. Select a photograph to take a closer look.</p></div><div className={styles.galleryGrid}>{client.gallery.map((photo, index) => <button id={`salon-gallery-${index + 1}`} className={styles.galleryButton} type="button" key={photo.src} aria-label={`View photograph: ${photo.alt}`} onClick={() => { setGalleryImage(photo); openModal("gallery"); }}><Image src={photo.src} alt={photo.alt} width={1000} height={1250} sizes="(max-width: 700px) 50vw, 25vw" unoptimized /></button>)}</div>{client.instagramUrl && <a id="salon-instagram-link" className={styles.instagramLink} href={client.instagramUrl}>See the studio on Instagram →</a>}</section>

      <section className={styles.demoClosing} id="salon-contact" data-reveal><div><p className={styles.eyebrow}>Your business could look like this</p><h2>A website with<br /><em>your own character.</em></h2><p>This example shows a complete salon website. Motus can build around your services, products, photographs and the way you take bookings.</p></div><div className={styles.closingActions}><Link id="salon-ask-motus" className={`${styles.actionButton} ${styles.redButton}`} href="/?example=salon-website#contact">Ask Motus about a website →</Link><button id="salon-try-enquiry" className={`${styles.actionButton} ${styles.outlineButton}`} type="button" onClick={() => openModal("enquiry")}>Try the salon enquiry</button><Link id="salon-other-examples" href="/demos">Explore the other examples →</Link></div></section>

      <footer className={styles.footer}><a id="salon-footer-home" className={styles.wordmark} href="#salon-top"><span className={styles.monogram}>{client.shortName}</span><span><strong>{client.name}</strong><small>Fictional salon demo</small></span></a><p>Made by Motus. Example services, products and prices. Nothing is booked, bought or sent. Your demo choices disappear when you refresh.</p><div>{links.map(([id, label]) => <a id={`salon-footer-${id}`} key={id} href={`#salon-${id}`}>{label}</a>)}</div><details className={styles.credits}><summary id="salon-photo-credits">Stock photography credits</summary><ul>{[client.hero, client.story, client.care, ...client.gallery].filter((photo, index, all) => all.findIndex((item) => item.src === photo.src) === index).map((photo, index) => <li key={photo.src}><a id={`salon-photo-source-${index + 1}`} href={photo.source} target="_blank" rel="noreferrer">{photo.credit} · Pexels ↗</a></li>)}</ul><a id="salon-photo-license" href="https://www.pexels.com/license/" target="_blank" rel="noreferrer">Pexels licence ↗</a></details></footer>

      <dialog ref={dialog} className={`${styles.demoDialog} ${modal === "gallery" ? styles.imageDialog : ""}`} aria-labelledby="salon-dialog-title" aria-describedby="salon-dialog-notice" onClose={() => { setModal(null); setDone(false); }} onClick={(event) => { if (event.target === event.currentTarget) setModal(null); }}>
        <div className={styles.dialogInner}><div className={styles.dialogHeading}><p className={styles.eyebrow}>{client.name} · Demo</p><button id="salon-dialog-close" type="button" aria-label="Close demo window" onClick={() => setModal(null)}>×</button></div><h2 id="salon-dialog-title">{modal === "booking" ? done ? "Your appointment preview" : "Make time for you." : modal === "bag" ? done ? "Your product enquiry preview" : "Your collection." : modal === "gallery" ? "Style inspiration" : done ? "Your enquiry preview" : "Let’s talk hair."}</h2><p id="salon-dialog-notice" className={styles.smallNote}>{modal === "gallery" ? "Stock photography. This is not a photograph of a client's work." : "Demo only. No real booking, payment or message. No personal details needed."}</p>
          {modal === "booking" && (done ? <div className={styles.confirmation} role="status"><span>Appointment request preview</span><h3>{chosenService.name}</h3><p>{day} · {time} · {chosenService.duration}</p><strong>From {money(chosenService.price)} · Example price</strong><p>On a real salon website, the studio would confirm the request. This demo has reserved nothing.</p><button id="salon-book-again" type="button" onClick={() => setDone(false)}>Try another appointment →</button></div> : <form className={styles.demoForm} onSubmit={preview}><label htmlFor="salon-booking-service">Your service<select id="salon-booking-service" value={service} onChange={(event) => setService(event.target.value)}>{client.services.map((item) => <option key={item.id} value={item.id}>{item.name} — from {money(item.price)}</option>)}</select></label><fieldset><legend>Example day</legend><div className={styles.choiceGrid}>{["Tuesday", "Thursday", "Saturday"].map((item) => <button id={`salon-day-${item.toLowerCase()}`} type="button" key={item} aria-pressed={day === item} onClick={() => setDay(item)}>{item}</button>)}</div></fieldset><fieldset><legend>Example time</legend><div className={styles.choiceGrid}>{["10:00", "12:30", "15:00"].map((item) => <button id={`salon-time-${item.replace(":", "-")}`} type="button" key={item} aria-pressed={time === item} onClick={() => setTime(item)}>{item}</button>)}</div></fieldset><p className={styles.bookingSummary}>{chosenService.name}<strong>{day}, {time} · From {money(chosenService.price)}</strong></p><button id="salon-preview-booking" className={`${styles.actionButton} ${styles.redButton}`} type="submit">Preview appointment request →</button></form>)}
          {modal === "bag" && (done ? <div className={styles.confirmation} role="status"><span>Product enquiry preview</span><h3>{bagCount} {bagCount === 1 ? "piece" : "pieces"} · {money(bagTotal)}</h3><p>On a real site, the studio would confirm the products, price and collection or delivery. No order or payment has been made.</p><button id="salon-back-to-bag" type="button" onClick={() => setDone(false)}>Back to your bag →</button></div> : bag.length ? <div><ul className={styles.demoBag}>{bag.map((item) => <li key={item.key}><Image src={item.image.src} alt={item.image.alt} width={80} height={100} unoptimized /><div><h3>{item.name}</h3><p>{item.variant} · {money(item.price)}</p><label htmlFor={`salon-quantity-${item.key.replaceAll(" ", "-")}`}>Quantity<select id={`salon-quantity-${item.key.replaceAll(" ", "-")}`} value={item.quantity} onChange={(event) => setBag((current) => current.map((line) => line.key === item.key ? { ...line, quantity: Number(event.target.value) } : line))}>{Array.from({ length: 10 }, (_, index) => <option key={index} value={index + 1}>{index + 1}</option>)}</select></label></div><button id={`salon-remove-${item.key.replaceAll(" ", "-")}`} type="button" aria-label={`Remove ${item.name}, ${item.variant}`} onClick={() => setBag((current) => current.filter((line) => line.key !== item.key))}>Remove</button></li>)}</ul><div className={styles.bagTotal}><span>Example total</span><strong>{money(bagTotal)}</strong></div><button id="salon-preview-product-enquiry" className={`${styles.actionButton} ${styles.redButton}`} type="button" onClick={() => setDone(true)}>Preview product enquiry →</button></div> : <div className={styles.confirmation}><h3>Your bag has room for a new look.</h3><p>Explore the example collection and add a piece to try the product enquiry.</p><a id="salon-empty-bag-shop" href="#salon-products" onClick={() => setModal(null)}>Explore the collection →</a></div>)}
          {modal === "enquiry" && (done ? <div className={styles.confirmation} role="status"><span>Enquiry preview</span><h3>{topic}</h3><p>A real enquiry would go to the studio for a reply. This is a demonstration; no message has been sent.</p><button id="salon-enquire-again" type="button" onClick={() => setDone(false)}>Try another topic →</button></div> : <form className={styles.demoForm} onSubmit={preview}><label htmlFor="salon-enquiry-topic">What would you like to ask about?<select id="salon-enquiry-topic" value={topic} onChange={(event) => setTopic(event.target.value)}>{["Choosing a service", "Wigs and bundles", "Hair care", "An appointment"].map((item) => <option key={item}>{item}</option>)}</select></label><p>On a live website, customers could leave contact details and a message here. For this demo, just choose a topic.</p><button id="salon-preview-enquiry" className={`${styles.actionButton} ${styles.redButton}`} type="submit">Preview enquiry →</button></form>)}
          {modal === "gallery" && <figure className={styles.galleryPreview}><Image src={galleryImage.src} alt={galleryImage.alt} width={1000} height={1250} unoptimized /><figcaption>{galleryImage.credit} · Stock photograph</figcaption></figure>}
        </div>
      </dialog>
    </main>
  );
}
