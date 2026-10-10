"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { salonDemo, type ClientConfig, type SalonImage } from "@/src/clients/salon-demo";
import styles from "./salon-site.module.css";

const client: ClientConfig = salonDemo;
const money = (amount: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(amount);
const links = [["about", "The studio"], ["services", "Services"], ["products", "Collection"], ["care", "Hair care"], ["gallery", "The edit"]];
const safeId = (value: string) => value.replace(/[^a-zA-Z0-9-]/g, "-");
type BagItem = { key: string; name: string; variant: string; price: number; quantity: number; image: SalonImage };
type Modal = "booking" | "bag" | "enquiry" | "gallery" | null;

export default function SalonDemo() {
  const site = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const dialogTitle = useRef<HTMLHeadingElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [filter, setFilter] = useState<"all" | "bundle" | "wig">("all");
  const [variants, setVariants] = useState<Record<string, number>>({});
  const [bag, setBag] = useState<BagItem[]>([]);
  const [service, setService] = useState(client.services[0].id);
  const [bookingStep, setBookingStep] = useState<0 | 1>(0);
  const [day, setDay] = useState("Tuesday");
  const [time, setTime] = useState("10:00");
  const [topic, setTopic] = useState("Choosing a service");
  const [done, setDone] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [feedbackVersion, setFeedbackVersion] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const bagCount = bag.reduce((sum, item) => sum + item.quantity, 0);
  const bagTotal = bag.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const chosenService = client.services.find((item) => item.id === service) ?? client.services[0];
  const featured = client.services.find((item) => item.id === client.featuredService.id) ?? client.services[0];
  const filtered = client.products.filter((item) => filter === "all" || item.category === filter);
  const galleryImage = client.gallery[galleryIndex];
  const photoCredits = [client.hero, client.story, client.care, client.featuredService.image, ...client.gallery, ...client.products.map((item) => item.image)]
    .filter((photo, index, all) => all.findIndex((item) => item.src === photo.src) === index);

  useEffect(() => {
    const root = site.current;
    if (!root) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    let observer: IntersectionObserver | undefined;
    const revealAll = () => {
      elements.forEach((element) => { element.dataset.revealed = "true"; });
      delete root.dataset.motion;
      observer?.disconnect();
    };
    if (media.matches || !("IntersectionObserver" in window)) revealAll();
    else {
      root.dataset.motion = "ready";
      observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.revealed = "true";
          observer?.unobserve(entry.target);
        }
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
    return () => {
      observer?.disconnect();
      delete root.dataset.motion;
      media.removeEventListener("change", handlePreference);
      root.removeEventListener("focusin", handleFocus);
    };
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
    if (!modal) return;
    const frame = requestAnimationFrame(() => {
      if (!dialog.current?.open) return;
      dialog.current.scrollTop = 0;
      dialogTitle.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [modal, bookingStep, done]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenuOpen(false); menuTrigger.current?.focus(); }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  useEffect(() => {
    if (!lastAdded) return;
    const timer = window.setTimeout(() => {
      if (!document.activeElement?.closest("[data-bag-feedback]")) setLastAdded(null);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [lastAdded, feedbackVersion]);

  const openModal = (kind: Modal) => {
    setDone(false); setBookingStep(0); setMenuOpen(false); setModal(kind);
  };
  const book = (id?: string) => { if (id) setService(id); openModal("booking"); };
  const addProduct = (productId: string) => {
    const product = client.products.find((item) => item.id === productId);
    if (!product) return;
    const variant = product.variants[variants[productId] ?? 0];
    const key = product.id + "-" + variant.label;
    if ((bag.find((item) => item.key === key)?.quantity ?? 0) >= 10) return;
    setBag((current) => {
      const existing = current.find((item) => item.key === key);
      return existing
        ? current.map((item) => item.key === key ? { ...item, quantity: Math.min(item.quantity + 1, 10) } : item)
        : [...current, { key, name: product.name, variant: variant.label, price: variant.price, quantity: 1, image: product.image }];
    });
    setAnnouncement(product.name + ", " + variant.label + ", added to your demo bag.");
    setLastAdded(key); setFeedbackVersion((value) => value + 1);
  };
  const removeProduct = (key: string) => {
    setBag((current) => current.filter((item) => item.key !== key));
    setAnnouncement("Piece removed from your demo bag.");
    dialogTitle.current?.focus({ preventScroll: true });
  };
  const preview = (event: FormEvent) => { event.preventDefault(); setDone(true); };
  const title = modal === "booking" ? done ? "Your appointment preview" : bookingStep === 0 ? "Your service." : "Your time."
    : modal === "bag" ? done ? "Your enquiry preview" : "Your collection."
    : modal === "gallery" ? "A closer look." : done ? "Your enquiry preview" : "Let’s talk hair.";

  return (
    <main ref={site} className={styles.site} id="salon-top">
      <a id="salon-skip-link" className={styles.skipLink} href="#salon-main">Skip to main content</a>
      <div className={styles.demoBar}>
        <Link id="salon-back-to-motus" href="/#examples">← Back to Motus</Link>
        <span><strong>Website demo</strong><span className={styles.demoBarDetail}> · Fictional studio. Nothing is booked or sent.</span></span>
      </div>
      <header className={styles.nav}>
        <a id="salon-home-link" className={styles.wordmark} href="#salon-top" aria-label={client.name + " demo home"}>
          <span className={styles.monogram}>{client.shortName}</span><span><strong>{client.name}</strong><small>Hair studio</small></span>
        </a>
        <nav className={styles.desktopNav} aria-label="Salon navigation">
          {links.map(([id, label]) => <a id={"salon-nav-" + id} href={"#salon-" + id} key={id}>{label}</a>)}
        </nav>
        <div className={styles.navActions}>
          <button id="salon-bag-button" className={styles.cartButton} type="button" onClick={() => openModal("bag")} aria-label={"Open demo bag, " + bagCount + " items"}>
            Bag <span className={styles.bagCount} key={bagCount}>{bagCount}</span>
          </button>
          <button id="salon-book-nav" className={styles.primaryButton} type="button" onClick={() => book()}>Book a visit <span aria-hidden="true">↗</span></button>
          <button ref={menuTrigger} id="salon-menu-button" className={styles.menuButton} type="button" aria-expanded={menuOpen} aria-controls="salon-mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
            <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span><span className={styles.srOnly}>{menuOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
        <nav id="salon-mobile-menu" className={styles.mobileNav + (menuOpen ? " " + styles.mobileNavOpen : "")} aria-label="Salon mobile navigation" aria-hidden={!menuOpen} inert={!menuOpen}>
          {links.map(([id, label]) => <a id={"salon-mobile-" + id} href={"#salon-" + id} key={id} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <button id="salon-mobile-enquiry" type="button" onClick={() => openModal("enquiry")}>Try an enquiry</button>
        </nav>
      </header>

      <section className={styles.hero} id="salon-main" aria-labelledby="salon-title" tabIndex={-1}>
        <div className={styles.heroMedia}><Image src={client.hero.src} alt={client.hero.alt} fill sizes="(max-width: 700px) 100vw, 70vw" priority unoptimized /></div>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{client.tagline}</p>
          <h1 id="salon-title"><span>{client.headline[0]}</span><em>{client.headline[1]}</em></h1>
          <p className={styles.heroCopy}>{client.introduction}</p>
          <div className={styles.heroActions}>
            <button id="salon-book-hero" className={styles.primaryButton} type="button" onClick={() => book()}>Make time for your hair <span aria-hidden="true">↗</span></button>
            <a id="salon-shop-hero" className={styles.textLink} href="#salon-products">Explore the collection <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <div className={styles.heroFoot}><span>Curls. Coils. Your own character.</span><a id="salon-discover-studio" href="#salon-about">Discover the studio <span aria-hidden="true">↓</span></a></div>
        <span className={styles.heroRail} aria-hidden="true">Hair, on your terms.</span>
      </section>

      <section className={styles.section + " " + styles.about} id="salon-about">
        <div className={styles.aboutCopy} data-reveal>
          <p className={styles.eyebrow}>The studio</p><h2>A little time.<br /><em>Just for you.</em></h2><p>{client.about}</p>
          <a id="salon-services-about" className={styles.textLink} href="#salon-services">Find your next appointment <span aria-hidden="true">↗</span></a>
          <p className={styles.smallNote}>{client.name} is an illustrative business. The photographs are stock imagery.</p>
        </div>
        <figure className={styles.aboutImage} data-reveal><Image src={client.story.src} alt={client.story.alt} width={1000} height={1250} sizes="(max-width: 700px) 100vw, 45vw" unoptimized /><figcaption>Individual texture. Individual care.</figcaption></figure>
      </section>

      <section className={styles.section + " " + styles.services} id="salon-services">
        <div className={styles.sectionHeading} data-reveal><div><p className={styles.eyebrow}>The appointment menu</p><h2>A style. A little<br /><em>self-care.</em></h2></div><p>A moment to settle in, talk through your look and find what works for your hair.</p></div>
        <div className={styles.serviceLayout}>
          <article className={styles.featuredService} data-reveal>
            <div className={styles.featuredImage}><Image src={client.featuredService.image.src} alt={client.featuredService.image.alt} width={1000} height={1100} sizes="(max-width: 700px) 100vw, 40vw" unoptimized /></div>
            <div className={styles.featuredCopy}><p className={styles.eyebrow}>{client.featuredService.label}</p><h3>{featured.name}</h3><p>{client.featuredService.note}</p>
              <div className={styles.featuredPrice}><span>{featured.duration}</span><strong>From {money(featured.price)}</strong></div>
              <button id={"salon-book-" + featured.id} className={styles.primaryButton + " " + styles.darkButton} type="button" onClick={() => book(featured.id)}>Explore this appointment <span aria-hidden="true">↗</span></button>
            </div>
          </article>
          <div className={styles.serviceMenu} data-reveal>
            <p className={styles.menuLabel}>Find your kind of care</p>
            {client.services.filter((item) => item.id !== featured.id).map((item) => (
              <article className={styles.serviceRow} key={item.id}>
                <div><h3>{item.name}</h3><p>{item.duration}</p></div><span className={styles.priceLeader} aria-hidden="true" />
                <div className={styles.servicePrice}><strong>From {money(item.price)}</strong><button id={"salon-book-" + item.id} type="button" aria-label={"Choose " + item.name} onClick={() => book(item.id)}>Choose <span aria-hidden="true">↗</span></button></div>
              </article>
            ))}
            <div className={styles.menuNote}><p>Not sure where to start?</p><button id="salon-service-enquiry" className={styles.textLink} type="button" onClick={() => openModal("enquiry")}>Start with a conversation <span aria-hidden="true">→</span></button></div>
          </div>
        </div>
        <p className={styles.sectionNote}>Example prices and durations. Try the booking preview; no appointment is reserved.</p>
      </section>

      <section className={styles.section + " " + styles.products} id="salon-products">
        <div className={styles.sectionHeading} data-reveal><div><p className={styles.eyebrow}>Considered pieces</p><h2>A change of look.<br /><em>Your kind of finish.</em></h2></div><p>Choose a length and try your collection. These stock photographs and example prices illustrate a product experience.</p></div>
        <div className={styles.collectionToolbar}><div className={styles.filters} role="group" aria-label="Filter the demo collection">
          {(["all", "bundle", "wig"] as const).map((item) => <button id={"salon-filter-" + item} key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}>{item === "bundle" ? "Bundles" : item === "wig" ? "Wigs" : "All pieces"}</button>)}
        </div><p className={styles.collectionCount} role="status">{filtered.length} pieces to explore</p></div>
        <div className={styles.productGrid} key={filter}>{filtered.map((product) => {
          const variant = product.variants[variants[product.id] ?? 0];
          const itemKey = product.id + "-" + variant.label;
          const atLimit = (bag.find((item) => item.key === itemKey)?.quantity ?? 0) >= 10;
          return <article className={styles.productCard} key={product.id}>
            <div className={styles.productImage}><Image src={product.image.src} alt={product.image.alt} width={1000} height={1250} sizes="(max-width: 700px) 90vw, 45vw" unoptimized /><span>{product.category === "bundle" ? "Bundles" : "Wigs"}</span></div>
            <div className={styles.productBody}><div className={styles.productHeading}><h3>{product.name}</h3><strong>{money(variant.price)}</strong></div><p>{product.description}</p>
              <div className={styles.productBuy}><label htmlFor={"salon-length-" + product.id}><span>Length</span><select id={"salon-length-" + product.id} value={variants[product.id] ?? 0} onChange={(event) => setVariants((current) => ({ ...current, [product.id]: Number(event.target.value) }))}>
                {product.variants.map((item, index) => <option key={item.label} value={index}>{item.label} — {money(item.price)}</option>)}
              </select></label><button id={"salon-add-" + product.id} className={styles.addButton} type="button" disabled={atLimit} onClick={() => addProduct(product.id)}>{atLimit ? "Limit reached" : lastAdded === itemKey ? "Added ✓" : "Add to bag +"}<span className={styles.srOnly}>: {product.name}, {variant.label}</span></button></div>
            </div>
          </article>;
        })}</div>
        <div className={styles.bagFeedback}><p>Your selection stays here while you explore.</p><button id="salon-view-bag" className={styles.textLink} type="button" onClick={() => openModal("bag")}>View your bag ({bagCount}) <span aria-hidden="true">→</span></button></div>
        <p className={styles.srOnly} role="status" aria-live="polite">{announcement}</p>
      </section>

      <section className={styles.section + " " + styles.care} id="salon-care">
        <div className={styles.careImage} data-reveal><Image src={client.care.src} alt={client.care.alt} width={1200} height={1600} sizes="(max-width: 700px) 100vw, 45vw" unoptimized /></div>
        <div className={styles.careCopy} data-reveal><p className={styles.eyebrow}>Care before everything</p><h2>Good hair days.<br /><em>Your own routine.</em></h2><p>Start with what your hair needs and how you like to wear it. A conversation can help you choose a service and plan your next appointment.</p>
          <dl className={styles.careNotes}><div><dt>Your texture</dt><dd>Time to talk about your curls, coils and preferred finish.</dd></div><div><dt>Your everyday routine</dt><dd>Choose care that fits the time you have at home.</dd></div><div><dt>Your next look</dt><dd>Discuss a protective style, a fitting or a change of pace.</dd></div></dl>
          <button id="salon-book-care" className={styles.textLink} type="button" onClick={() => book("conditioning")}>Explore a care appointment <span aria-hidden="true">↗</span></button>
        </div>
      </section>

      <section className={styles.gallerySection} id="salon-gallery">
        <div className={styles.galleryHeading} data-reveal><p className={styles.eyebrow}>The texture edit</p><h2>Not one look.<br /><em>Your own.</em></h2><p>A study in texture, presence and the care behind it.</p></div>
        <div className={styles.editorialGrid}>{client.gallery.map((photo, index) => (
          <figure className={styles.galleryFigure} key={photo.src} data-reveal>
            <button id={"salon-gallery-" + (index + 1)} className={styles.galleryButton} type="button" aria-label={"View photograph: " + photo.alt} onClick={() => { setGalleryIndex(index); openModal("gallery"); }}>
              <Image src={photo.src} alt={photo.alt} width={1000} height={1250} sizes={index === 0 ? "(max-width: 700px) 100vw, 55vw" : "(max-width: 700px) 45vw, 30vw"} style={{ objectPosition: photo.position }} unoptimized />
              <span className={styles.zoomLabel}>Look closer <span aria-hidden="true">↗</span></span>
            </button><figcaption><span>0{index + 1}</span>{photo.caption}</figcaption>
          </figure>
        ))}</div>
        <div className={styles.editorialFoot}><p>Stock photography celebrating Black women and natural texture.</p><span>Texture. Care. Character.</span></div>
        {client.instagramUrl && <a id="salon-instagram-link" className={styles.textLink} href={client.instagramUrl}>See the studio on Instagram →</a>}
      </section>

      <section className={styles.demoClosing} id="salon-contact" data-reveal>
        <div><p className={styles.eyebrow}>Your business could look like this</p><h2>Your character.<br /><em>On every page.</em></h2><p>Motus can build around your services, products, photographs and the way you take bookings.</p></div>
        <div className={styles.closingActions}><Link id="salon-ask-motus" className={styles.primaryButton} href="/?example=salon-website#contact">Ask Motus about a website <span aria-hidden="true">↗</span></Link><Link id="salon-design-notes" className={styles.textLink} href="/demos#example-salon-website">Read the design story <span aria-hidden="true">→</span></Link><button id="salon-try-enquiry" className={styles.textLink} type="button" onClick={() => openModal("enquiry")}>Try the salon enquiry <span aria-hidden="true">→</span></button></div>
      </section>
      <footer className={styles.footer}>
        <a id="salon-footer-home" className={styles.wordmark} href="#salon-top"><span className={styles.monogram}>{client.shortName}</span><span><strong>{client.name}</strong><small>Fictional salon demo</small></span></a>
        <p>Made by Motus. Example services, products and prices. Nothing is booked, bought or sent. Your demo choices disappear when you refresh.</p>
        <details className={styles.credits}><summary id="salon-photo-credits">Stock photography credits</summary><ul>{photoCredits.map((photo, index) => <li key={photo.src}><a id={"salon-photo-source-" + (index + 1)} href={photo.source} target="_blank" rel="noreferrer">{photo.credit} · Pexels ↗</a></li>)}</ul><a id="salon-photo-license" href="https://www.pexels.com/license/" target="_blank" rel="noreferrer">Pexels licence ↗</a></details>
      </footer>
      {lastAdded && !modal && <div className={styles.bagToast} key={feedbackVersion} data-bag-feedback><span>{announcement}</span><button id="salon-toast-view-bag" type="button" onClick={() => openModal("bag")}>View bag →</button></div>}

      <dialog ref={dialog} className={styles.demoDialog + (modal === "gallery" ? " " + styles.imageDialog : "")} aria-labelledby="salon-dialog-title" aria-describedby="salon-dialog-notice" onClose={() => { setModal(null); setDone(false); }} onClick={(event) => { if (event.target === event.currentTarget) setModal(null); }}>
        <div className={styles.dialogInner}>
          <div className={styles.dialogHeading}><p className={styles.eyebrow}>{client.name} · Demo</p><button id="salon-dialog-close" type="button" aria-label="Close demo window" onClick={() => setModal(null)}>×</button></div>
          <h2 id="salon-dialog-title" ref={dialogTitle} tabIndex={-1}>{title}</h2>
          <p id="salon-dialog-notice" className={styles.smallNote}>{modal === "gallery" ? "Stock photography, rather than a photograph of a client’s work." : "Demo only. No real booking, payment or message. No personal details needed."}</p>

          {modal === "booking" && <>
            {!done && <ol className={styles.bookingProgress} aria-label="Booking steps"><li aria-current={bookingStep === 0 ? "step" : undefined}><span>1</span> Choose a service</li><li aria-current={bookingStep === 1 ? "step" : undefined}><span>2</span> Choose a time</li></ol>}
            <div className={styles.dialogPanel} key={done ? "complete" : bookingStep}>
              {done ? <div className={styles.confirmation} role="status"><p className={styles.eyebrow}>Appointment request preview</p><h3>{chosenService.name}</h3><p>{day} · {time} · {chosenService.duration}</p><strong>From {money(chosenService.price)} · Example price</strong><p>On a real salon website, the studio would confirm the request. This demo has reserved nothing.</p><button id="salon-book-again" className={styles.textLink} type="button" onClick={() => { setDone(false); setBookingStep(0); }}>Try another appointment →</button></div>
                : bookingStep === 0 ? <div className={styles.demoForm}><label htmlFor="salon-booking-service">Your service<select id="salon-booking-service" value={service} onChange={(event) => setService(event.target.value)}>{client.services.map((item) => <option key={item.id} value={item.id}>{item.name} — from {money(item.price)}</option>)}</select></label><div className={styles.servicePreview} aria-live="polite"><p>{chosenService.description}</p><span>{chosenService.duration}</span><strong>From {money(chosenService.price)}</strong></div><button id="salon-booking-next" className={styles.primaryButton} type="button" onClick={() => setBookingStep(1)}>Choose a time <span aria-hidden="true">→</span></button></div>
                  : <form className={styles.demoForm} onSubmit={preview}><fieldset><legend>Example day</legend><div className={styles.choiceGrid}>{["Tuesday", "Thursday", "Saturday"].map((item) => <button id={"salon-day-" + item.toLowerCase()} key={item} type="button" aria-pressed={day === item} onClick={() => setDay(item)}>{item}</button>)}</div></fieldset><fieldset><legend>Example time</legend><div className={styles.choiceGrid}>{["10:00", "12:30", "15:00"].map((item) => <button id={"salon-time-" + safeId(item)} key={item} type="button" aria-pressed={time === item} onClick={() => setTime(item)}>{item}</button>)}</div></fieldset><div className={styles.bookingSummary} aria-live="polite"><div><strong>{chosenService.name}</strong><span>{day} · {time} · {chosenService.duration}</span><span>From {money(chosenService.price)} · Example price</span></div><button id="salon-booking-back" type="button" onClick={() => setBookingStep(0)}>Change service</button></div><button id="salon-preview-booking" className={styles.primaryButton} type="submit">Preview appointment request <span aria-hidden="true">↗</span></button></form>}
            </div>
          </>}

          {modal === "bag" && <div className={styles.dialogPanel} key={done ? "complete" : "bag"}>
            {done ? <div className={styles.confirmation} role="status"><p className={styles.eyebrow}>Product enquiry preview</p><h3>{bagCount} {bagCount === 1 ? "piece" : "pieces"} · {money(bagTotal)}</h3><p>A real studio could follow up about availability and the right fit. This demo has placed no order and sent no message.</p><button id="salon-bag-back" className={styles.textLink} type="button" onClick={() => setDone(false)}>Back to your bag →</button></div>
              : bag.length ? <><ul className={styles.demoBag}>{bag.map((item) => <li key={item.key}><Image src={item.image.src} alt={item.image.alt} width={100} height={125} unoptimized /><div><h3>{item.name}</h3><p>{item.variant} · {money(item.price)} each</p><label htmlFor={"salon-quantity-" + safeId(item.key)}>Quantity<select id={"salon-quantity-" + safeId(item.key)} value={item.quantity} onChange={(event) => setBag((current) => current.map((piece) => piece.key === item.key ? { ...piece, quantity: Number(event.target.value) } : piece))}>{Array.from({ length: 10 }, (_, index) => <option value={index + 1} key={index + 1}>{index + 1}</option>)}</select></label></div><button id={"salon-remove-" + safeId(item.key)} type="button" aria-label={"Remove " + item.name + ", " + item.variant} onClick={() => removeProduct(item.key)}>Remove</button></li>)}</ul><div className={styles.bagTotal} aria-live="polite"><span>{bagCount} {bagCount === 1 ? "piece" : "pieces"}</span><strong>{money(bagTotal)}</strong></div><button id="salon-preview-product-enquiry" className={styles.primaryButton} type="button" onClick={() => setDone(true)}>Preview product enquiry <span aria-hidden="true">↗</span></button></>
                : <div className={styles.emptyBag}><span className={styles.emptyBagMark} aria-hidden="true">{client.shortName}</span><h3>A little room<br />for a new look.</h3><p>Choose a piece and a length to see your selection here.</p><a id="salon-empty-bag-shop" className={styles.primaryButton} href="#salon-products" onClick={() => setModal(null)}>Explore the collection <span aria-hidden="true">→</span></a></div>}
          </div>}

          {modal === "enquiry" && <div className={styles.dialogPanel} key={done ? "complete" : "enquiry"}>{done ? <div className={styles.confirmation} role="status"><h3>{topic}</h3><p>That is how the enquiry confirmation could look. Nothing has been sent.</p><button id="salon-enquire-again" className={styles.textLink} type="button" onClick={() => setDone(false)}>Try another enquiry →</button></div>
            : <form className={styles.demoForm} onSubmit={preview}><label htmlFor="salon-enquiry-topic">What would you like to talk about?<select id="salon-enquiry-topic" value={topic} onChange={(event) => setTopic(event.target.value)}>{["Choosing a service", "Wigs and bundles", "Hair care", "A future appointment"].map((item) => <option key={item}>{item}</option>)}</select></label><button id="salon-preview-enquiry" className={styles.primaryButton} type="submit">Preview the enquiry <span aria-hidden="true">↗</span></button></form>}</div>}

          {modal === "gallery" && <div className={styles.galleryPreview}><Image key={galleryImage.src} src={galleryImage.src} alt={galleryImage.alt} width={1000} height={1250} unoptimized /><p>{galleryImage.caption}<span>{galleryImage.credit} · Pexels</span></p><div className={styles.galleryControls}><button id="salon-gallery-previous" type="button" onClick={() => setGalleryIndex((index) => (index + client.gallery.length - 1) % client.gallery.length)} aria-label="Previous photograph">←</button><span role="status">{galleryIndex + 1} / {client.gallery.length}</span><button id="salon-gallery-next" type="button" onClick={() => setGalleryIndex((index) => (index + 1) % client.gallery.length)} aria-label="Next photograph">→</button></div></div>}
        </div>
      </dialog>
    </main>
  );
}
