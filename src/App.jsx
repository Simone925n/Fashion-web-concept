import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  X,
  Search,
  Menu,
  Check,
  Heart,
  ChevronDown,
} from 'lucide-react';

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;
const money = (value) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
const products = [
  {
    id: 'han-jacket',
    name: 'Han stand-collar jacket',
    category: 'Outerwear',
    price: 340,
    color: 'Chalk',
    hex: '#ddd8c7',
    material: 'Silk · Linen',
    panel: 0,
    focus: 4,
    description:
      'A familiar silhouette, quietly reimagined. A soft stand collar meets an off-centre closure, with a generous cut that gives the body room to move.',
    composition: '70% linen, 30% mulberry silk',
    fit: 'Relaxed, architectural fit. Take your usual size for an oversized silhouette. Model is 176 cm and wears size S.',
  },
  {
    id: 'yun-shirt',
    name: 'Yun cotton shirt',
    category: 'Shirts',
    price: 245,
    color: 'Muted jade',
    hex: '#8e9583',
    material: 'Organic cotton',
    panel: 1,
    focus: 4,
    description:
      'An elongated shirt with a clean stand collar and concealed placket. Cut from airy organic cotton, Yun moves effortlessly between structure and ease.',
    composition: '100% organic cotton',
    fit: 'Unisex, relaxed fit with a dropped shoulder. Model is 185 cm and wears size M.',
  },
  {
    id: 'mo-jacket',
    name: 'Mo wool wrap jacket',
    category: 'Outerwear',
    price: 425,
    color: 'Ink',
    hex: '#343638',
    material: 'Virgin wool',
    panel: 2,
    focus: 4,
    description:
      'An architectural wrap, softened by the hand of fine wool. A single knotted fastening quietly recalls traditional construction. Designed to layer, season after season.',
    composition: '100% responsibly sourced virgin wool. Lining: 100% cotton',
    fit: 'Relaxed fit with a sculptural sleeve. Model is 176 cm and wears size S.',
  },
  {
    id: 'liu-top',
    name: 'Liu silk wrap top',
    category: 'Shirts',
    price: 185,
    color: 'Stone',
    hex: '#b7b1a3',
    material: 'Silk · Cotton',
    panel: 3,
    focus: 4,
    description:
      'Fluid lines and a softly folded neckline. A fine side tie allows you to shape the silhouette, while a silk-cotton weave catches the light with a subtle lustre.',
    composition: '55% mulberry silk, 45% cotton',
    fit: 'Easy fit with an adjustable side tie. Model is 178 cm and wears size S.',
  },
  {
    id: 'yun-trousers',
    name: 'Yun pleated trousers',
    category: 'Bottoms',
    price: 225,
    color: 'Ink',
    hex: '#343638',
    material: 'Wool · Linen',
    panel: 1,
    focus: 100,
    description:
      'Full-length trousers with deep pleats and generous volume. A softly tailored waist balances the flowing leg, creating a silhouette that feels considered and effortless.',
    composition: '60% wool, 40% linen',
    fit: 'High-rise, wide-leg fit. Model is 185 cm and wears size M.',
  },
  {
    id: 'liu-trousers',
    name: 'Liu flowing trousers',
    category: 'Bottoms',
    price: 265,
    color: 'Chalk',
    hex: '#ddd8c7',
    material: 'Silk · Linen',
    panel: 3,
    focus: 100,
    description:
      'A study in movement. Weightless silk-linen trousers with a softly elasticated back waist and a full, flowing leg. Made for long days and unhurried evenings.',
    composition: '70% linen, 30% mulberry silk',
    fit: 'High-rise, flowing fit. Model is 178 cm and wears size S.',
  },
  {
    id: 'mei-skirt',
    name: 'Mei pleated skirt',
    category: 'Bottoms',
    price: 295,
    color: 'Ink',
    hex: '#343638',
    material: 'Virgin wool',
    panel: 2,
    focus: 100,
    description:
      'Clean lines give way to generous folds. A full-length skirt that brings gentle movement to structured dressing, cut from the same fine wool as our Mo wrap jacket.',
    composition: '100% responsibly sourced virgin wool',
    fit: 'Sits at the natural waist. Full-length silhouette. Model is 176 cm and wears size S.',
  },
];
const categories = ['All pieces', 'Outerwear', 'Shirts', 'Bottoms'];
const sizes = ['XS', 'S', 'M', 'L', 'XL'];

function useStoredState(key, fallback) {
  const [state, setState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* Browsing remains available when storage is disabled. */
    }
  }, [key, state]);
  return [state, setState];
}

function Modal({ children, title, onClose, className = '' }) {
  const ref = useRef(null);
  const returnFocus = useRef(document.activeElement);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = returnFocus.current;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const background = [...document.querySelectorAll('.header, main, .footer')];
    background.forEach((element) => {
      element.inert = true;
    });
    const focusables = () =>
      [
        ...ref.current.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]'),
      ].filter((el) => !el.disabled && el.getClientRects().length);
    (ref.current.querySelector('[data-initial-focus]') || focusables()[0] || ref.current).focus();
    const handler = (event) => {
      if (event.key === 'Escape') closeRef.current();
      if (event.key === 'Tab') {
        const items = focusables();
        if (!items.length) {
          event.preventDefault();
          return;
        }
        if (event.shiftKey && document.activeElement === items[0]) {
          event.preventDefault();
          items.at(-1).focus();
        } else if (!event.shiftKey && document.activeElement === items.at(-1)) {
          event.preventDefault();
          items[0].focus();
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = oldOverflow;
      background.forEach((element) => {
        element.inert = false;
      });
      document.removeEventListener('keydown', handler);
      const target = previous?.isConnected
        ? previous
        : document.querySelector('.header .bag-toggle');
      target?.focus();
    };
  }, []);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className={`modal ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={ref}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-heading">
          <span className="eyebrow">{title}</span>
          <button className="icon-button" onClick={onClose} aria-label={`Close ${title}`}>
            <X size={21} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function ProductImage({ product, className = '' }) {
  return (
    <div
      className={`product-photo ${className}`}
      role="img"
      aria-label={`${product.name} in ${product.color}, shown on a model`}
      style={{ backgroundPosition: `${(product.panel * 100) / 3}% ${product.focus}%` }}
    />
  );
}

function ProductCard({ product, saved, onSave }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <a href={`#/product/${product.id}`} aria-label={`Discover ${product.name}`}>
          <ProductImage product={product} />
        </a>
        <button
          className={`save-button ${saved ? 'is-saved' : ''}`}
          aria-label={`${saved ? 'Unsave' : 'Save'} ${product.name}`}
          aria-pressed={saved}
          onClick={() => onSave(product.id)}
        >
          <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <a
          className="product-discover"
          href={`#/product/${product.id}`}
          aria-label={`View ${product.name}`}
        >
          <Plus size={19} />
        </a>
      </div>
      <div className="product-card-info">
        <a href={`#/product/${product.id}`}>{product.name}</a>
        <span>{money(product.price)}</span>
      </div>
      <div className="product-card-meta">
        <span>{product.material}</span>
        <span className="color-dot" style={{ background: product.hex }} title={product.color} />
      </div>
    </article>
  );
}

function App() {
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || '/');
  const [overlay, setOverlay] = useState(null);
  const [bag, setBag] = useStoredState('jian-bag', []);
  const [saved, setSaved] = useStoredState('jian-saved', []);
  const [category, setCategory] = useState('All pieces');
  const [sort, setSort] = useState('edit');
  const [query, setQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeError, setSizeError] = useState(false);
  const [toast, setToast] = useState('');
  const [newsletterState, setNewsletterState] = useState('');
  const [email, setEmail] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const bagItems = bag
    .map((item) => ({ ...item, product: products.find((p) => p.id === item.id) }))
    .filter((item) => item.product);
  const bagCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = bagItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const currentProduct = route.startsWith('/product/')
    ? products.find((p) => p.id === route.split('/')[2])
    : null;

  useEffect(() => {
    const handler = () => {
      setRoute(window.location.hash.slice(1) || '/');
      setOverlay(null);
      setSelectedSize('');
      setSizeError(false);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  useEffect(() => {
    const names = {
      '/': 'The Art of Between',
      '/collection': 'Collection 01',
      '/campaign': 'The Art of Between — Campaign',
      '/about': 'Our Philosophy',
      '/saved': 'Saved Pieces',
    };
    document.title = `${currentProduct?.name || names[route] || 'Page not found'} — JIAN 间`;
  }, [route, currentProduct]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3200);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [route]);

  const onSave = (id) =>
    setSaved((old) => (old.includes(id) ? old.filter((item) => item !== id) : [...old, id]));
  const addToBag = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setBag((old) => {
      const found = old.find((item) => item.id === currentProduct.id && item.size === selectedSize);
      return found
        ? old.map((item) => (item === found ? { ...item, quantity: item.quantity + 1 } : item))
        : [...old, { id: currentProduct.id, size: selectedSize, quantity: 1 }];
    });
    setOrderComplete(false);
    setOverlay('bag');
  };
  const changeQuantity = (id, size, amount) =>
    setBag((old) =>
      old
        .map((item) =>
          item.id === id && item.size === size
            ? { ...item, quantity: item.quantity + amount }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  const subscribe = (event) => {
    event.preventDefault();
    try {
      localStorage.setItem('jian-newsletter', email);
    } catch {
      /* Preview can still show confirmation. */
    }
    setNewsletterState('success');
  };
  const card = (product) => (
    <ProductCard
      key={product.id}
      product={product}
      saved={saved.includes(product.id)}
      onSave={onSave}
    />
  );

  const footer = (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <a href="#/" className="wordmark">
            JIAN <span lang="zh">间</span>
          </a>
          <p>From the space between.</p>
          <span className="eyebrow">SHANGHAI · COPENHAGEN</span>
        </div>
        <div className="footer-links">
          <span className="eyebrow">EXPLORE</span>
          <a href="#/collection">The collection</a>
          <a href="#/campaign">The campaign</a>
          <a href="#/about">Our philosophy</a>
          <a href="#/saved">Saved pieces ({saved.length})</a>
        </div>
        <div className="footer-links">
          <span className="eyebrow">HERE TO HELP</span>
          <button onClick={() => setOverlay('shipping')}>Shipping & returns</button>
          <button onClick={() => setOverlay('care')}>Garment care</button>
          <button onClick={() => setOverlay('contact')}>Contact the studio</button>
        </div>
        <div className="newsletter">
          <span className="eyebrow">LETTERS FROM JIAN</span>
          <p>
            New collections. Quiet observations.
            <br />
            Only when we have something to share.
          </p>
          {newsletterState === 'success' ? (
            <p className="newsletter-success" role="status">
              <Check size={16} /> Thank you. You’re on the list for this preview.
            </p>
          ) : (
            <form onSubmit={subscribe}>
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button aria-label="Subscribe to letters from JIAN" type="submit">
                <ArrowRight size={20} />
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} JIAN. Thoughtfully made.</span>
        <button onClick={() => setOverlay('privacy')}>Privacy</button>
        <span>EUR € · English</span>
        <a href="#/" aria-label="JIAN homepage" className="footer-seal" lang="zh">
          间
        </a>
      </div>
    </footer>
  );

  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main-content').focus();
          document.getElementById('main-content').scrollIntoView();
        }}
      >
        Skip to content
      </a>
      <header className="header">
        <a href="#/" className="wordmark" aria-label="JIAN homepage">
          JIAN <span lang="zh">间</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a className={route === '/collection' ? 'active' : ''} href="#/collection">
            Collection <sup>01</sup>
          </a>
          <a className={route === '/campaign' ? 'active' : ''} href="#/campaign">
            Campaign
          </a>
          <a className={route === '/about' ? 'active' : ''} href="#/about">
            Philosophy
          </a>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button search-toggle"
            aria-label="Search pieces"
            onClick={() => {
              setQuery('');
              setOverlay('search');
            }}
          >
            <Search size={19} strokeWidth={1.5} />
          </button>
          <button
            className="bag-toggle"
            onClick={() => setOverlay('bag')}
            aria-label={`Open bag, ${bagCount} ${bagCount === 1 ? 'item' : 'items'}`}
          >
            Bag <span>({bagCount})</span>
          </button>
          <button
            className="icon-button mobile-menu-toggle"
            aria-label="Open menu"
            onClick={() => setOverlay('menu')}
          >
            <Menu size={23} strokeWidth={1.5} />
          </button>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        {route === '/' && (
          <>
            <section className="hero">
              <img
                src={assetUrl('images/campaign.png')}
                alt="JIAN campaign: a model in an ivory wrap jacket and ink trousers in a sunlit Shanghai stone courtyard"
                fetchPriority="high"
              />
              <div className="hero-shade" />
              <div className="hero-topline">
                <span className="eyebrow">COLLECTION 01 — A/W 2026</span>
                <span className="hero-character" lang="zh">
                  间
                </span>
              </div>
              <div className="hero-copy">
                <span className="eyebrow hero-pretitle">NEW PERSPECTIVES. QUIET CONNECTIONS.</span>
                <h1>
                  The art
                  <br />
                  of <em>between.</em>
                </h1>
                <p>
                  Chinese heritage. Scandinavian clarity.
                  <br />A new language of contemporary dressing.
                </p>
                <a href="#/collection" className="hero-cta">
                  Explore collection 01 <ArrowUpRight size={21} strokeWidth={1.4} />
                </a>
              </div>
              <div className="hero-bottom">
                <span>
                  SHANGHAI <span className="city-line" /> COPENHAGEN
                </span>
                <span className="hero-image-caption">A STUDY IN FORM, FEELING & SPACE</span>
                <span>01 / 01</span>
              </div>
            </section>
            <section className="intro-section page-width reveal">
              <div className="intro-index">
                <span className="tiny-square" />
                <span className="eyebrow">THE SPACE BETWEEN</span>
              </div>
              <h2>
                Rooted in heritage.
                <br />
                <em>Made for the present.</em>
              </h2>
              <div className="intro-body">
                <p>
                  There is a place where two worlds meet.
                  <br />
                  Where Eastern sensibility finds Northern simplicity.
                  <br />
                  Where the familiar becomes something new.
                </p>
                <a className="text-link" href="#/about">
                  This is JIAN <ArrowUpRight size={17} />
                </a>
              </div>
            </section>
            <section className="collection-section page-width reveal">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">CONSIDERED PIECES. EVERYDAY POSSIBILITIES.</span>
                  <h2>The first chapter</h2>
                </div>
                <a className="text-link" href="#/collection">
                  View the collection <ArrowUpRight size={18} />
                </a>
              </div>
              <div className="product-grid">{products.slice(0, 4).map(card)}</div>
              <div className="collection-note">
                <span>01 — THE ART OF BETWEEN</span>
                <span>Natural materials. Thoughtful construction. Lasting form.</span>
              </div>
            </section>
            <section className="editorial-section reveal">
              <div className="editorial-image">
                <img
                  src={assetUrl('images/editorial.png')}
                  loading="lazy"
                  alt="Two JIAN models walking through a modern Shanghai courtyard, wearing chalk and muted jade pieces"
                />
                <span className="image-label">A/W 2026 — SHANGHAI, CHINA</span>
              </div>
              <div className="editorial-copy">
                <span className="eyebrow">THE CAMPAIGN / 01</span>
                <h2>
                  A quieter
                  <br />
                  kind of
                  <br />
                  <em>presence.</em>
                </h2>
                <p>
                  Between the city and the stillness.
                  <br />
                  Between what we inherit and what we make.
                  <br />
                  Clothes to inhabit, not just to wear.
                </p>
                <a className="text-link" href="#/campaign">
                  Enter the story <ArrowUpRight size={18} />
                </a>
                <span className="editorial-chinese" lang="zh">
                  静中有形
                </span>
                <span className="editorial-translation">IN STILLNESS, THERE IS FORM.</span>
              </div>
            </section>
            <section className="philosophy-teaser page-width reveal">
              <span className="eyebrow">OUR WAY OF SEEING</span>
              <h2>
                Less, but with <em>meaning.</em>
              </h2>
              <p>
                A collar. A fold. The fall of a sleeve.
                <br />
                We believe the most important details are the ones you feel.
              </p>
              <a className="text-link" href="#/about">
                Discover our philosophy <ArrowUpRight size={18} />
              </a>
              <div className="philosophy-principles">
                <span>HERITAGE, WITHOUT NOSTALGIA</span>
                <span>SIMPLICITY, WITH SOUL</span>
                <span>DESIGNED TO STAY</span>
              </div>
            </section>
          </>
        )}

        {route === '/collection' && (
          <div className="page-width collection-page">
            <div className="page-heading">
              <span className="eyebrow">COLLECTION 01 — A/W 2026</span>
              <h1>
                The art of <em>between.</em>
              </h1>
              <p>
                A wardrobe of quiet connections. Architectural lines, natural materials
                <br className="desktop-break" /> and the freedom to make each piece your own.
              </p>
            </div>
            <div className="collection-toolbar">
              <div className="category-tabs" aria-label="Filter by category">
                {categories.map((c) => (
                  <button
                    key={c}
                    className={category === c ? 'active' : ''}
                    onClick={() => setCategory(c)}
                    aria-pressed={category === c}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <label className="sort-label">
                <span className="sr-only">Sort pieces</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="edit">The JIAN edit</option>
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                </select>
                <ChevronDown size={14} />
              </label>
            </div>
            <div className="product-grid collection-full-grid">
              {products
                .filter((p) => category === 'All pieces' || p.category === category)
                .sort((a, b) =>
                  sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : 0,
                )
                .map(card)}
            </div>
            <div className="collection-note">
              <span>
                {
                  products.filter((p) => category === 'All pieces' || p.category === category)
                    .length
                }{' '}
                CONSIDERED PIECES
              </span>
              <span>Designed between Shanghai and Copenhagen.</span>
            </div>
          </div>
        )}

        {currentProduct && (
          <>
            <div className="product-page page-width">
              <div className="product-breadcrumb">
                <a href="#/collection">Collection 01</a>
                <span>/</span>
                <span>{currentProduct.name}</span>
              </div>
              <div className="product-layout">
                <div className="product-gallery">
                  <ProductImage product={currentProduct} className="product-detail-photo" />
                  <span className="gallery-caption">
                    FORM / 01 — {currentProduct.color.toUpperCase()}
                  </span>
                  <div
                    className="garment-detail"
                    style={{ backgroundPosition: `${(currentProduct.panel * 100) / 3}% 28%` }}
                    role="img"
                    aria-label={`Close-up of ${currentProduct.name} fabric and construction`}
                  />
                  <p className="image-footnote">
                    Collection imagery is an art direction study. Garments are shown as visual
                    concepts.
                  </p>
                </div>
                <div className="product-details">
                  <span className="eyebrow">JIAN / COLLECTION 01</span>
                  <h1>{currentProduct.name}</h1>
                  <div className="product-price">
                    {money(currentProduct.price)}
                    <span>Including taxes</span>
                  </div>
                  <p className="product-description">{currentProduct.description}</p>
                  <div className="product-color">
                    <span className="color-dot" style={{ background: currentProduct.hex }} />
                    <span>{currentProduct.color}</span>
                    <span>{currentProduct.material}</span>
                  </div>
                  <div className="size-heading">
                    <span className="eyebrow">SELECT SIZE</span>
                    <button className="underlined" onClick={() => setOverlay('size')}>
                      Size guide
                    </button>
                  </div>
                  <div className="size-options" role="group" aria-label="Select size">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        className={selectedSize === size ? 'selected' : ''}
                        aria-pressed={selectedSize === size}
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {sizeError && (
                    <p className="field-error" role="alert">
                      Please choose a size to add this piece.
                    </p>
                  )}
                  <button className="primary-button add-button" onClick={addToBag}>
                    Add to bag <Plus size={18} />
                  </button>
                  <button className="save-piece" onClick={() => onSave(currentProduct.id)}>
                    <Heart
                      size={15}
                      fill={saved.includes(currentProduct.id) ? 'currentColor' : 'none'}
                    />
                    {saved.includes(currentProduct.id) ? 'Piece saved' : 'Save this piece'}
                  </button>
                  <p className="shipping-note">
                    Complimentary shipping on orders over €300.
                    <br />
                    Thoughtfully packaged. 30-day returns.
                  </p>
                  <div className="product-accordions">
                    <details open>
                      <summary>
                        Composition & care <Plus size={16} />
                      </summary>
                      <p>
                        {currentProduct.composition}.<br />
                        Air between wears. Gentle professional dry cleaning recommended. Store away
                        from direct sunlight.
                      </p>
                    </details>
                    <details>
                      <summary>
                        Fit & construction <Plus size={16} />
                      </summary>
                      <p>{currentProduct.fit}</p>
                    </details>
                    <details>
                      <summary>
                        Shipping & returns <Plus size={16} />
                      </summary>
                      <p>
                        EU delivery in 3–5 working days. International delivery in 5–10 working
                        days. Shipping is €15, complimentary over €300. Return unworn pieces within
                        30 days. This is a fictional brand preview; no purchases are processed.
                      </p>
                    </details>
                  </div>
                </div>
              </div>
            </div>
            <section className="page-width related-section">
              <div className="section-heading">
                <h2>In good company</h2>
                <a className="text-link" href="#/collection">
                  Explore all pieces <ArrowUpRight size={16} />
                </a>
              </div>
              <div className="product-grid">
                {products
                  .filter((p) => p.id !== currentProduct.id)
                  .slice(0, 4)
                  .map(card)}
              </div>
            </section>
          </>
        )}

        {route === '/campaign' && (
          <div className="campaign-page">
            <div className="page-heading page-width">
              <span className="eyebrow">CAMPAIGN 01 / SHANGHAI</span>
              <h1>
                A quieter kind
                <br />
                of <em>presence.</em>
              </h1>
              <p>A study in form, feeling and the spaces we move through.</p>
            </div>
            <figure className="campaign-wide">
              <img
                src={assetUrl('images/campaign.png')}
                alt="A JIAN model in ivory silk-linen, framed by warm stone and translucent timber screens"
              />
              <figcaption>
                <span>01 / THE ART OF BETWEEN</span>
                <span>SHANGHAI, A/W 2026</span>
              </figcaption>
            </figure>
            <section className="story-grid page-width">
              <div className="story-text">
                <span className="eyebrow">BETWEEN THE CITY AND THE STILLNESS</span>
                <h2>
                  Clothes to <em>inhabit.</em>
                </h2>
                <p>
                  Morning light moves across a stone wall. A sleeve falls, a collar turns, a
                  silhouette shifts. Nothing is hurried. Everything has a reason to be here.
                </p>
                <p>
                  For our first collection, we looked to the spaces between things: the courtyard
                  between rooms, the pause between movements, the meeting of two ways of seeing.
                </p>
                <p>
                  Photographed among Shanghai’s quiet architectural corners, The Art of Between
                  explores a wardrobe that feels at home wherever you find yourself.
                </p>
                <a href="#/collection" className="text-link">
                  Discover the collection <ArrowUpRight size={18} />
                </a>
                <span className="story-chinese" lang="zh">
                  留白
                </span>
                <span className="eyebrow">LEAVING SPACE FOR POSSIBILITY</span>
              </div>
              <img
                src={assetUrl('images/editorial.png')}
                loading="lazy"
                alt="Two models in contemporary JIAN silhouettes, walking among stone and dark timber"
              />
            </section>
            <div className="campaign-closing">
              <span className="eyebrow">A/W 2026 — COLLECTION 01</span>
              <h2>
                Wear your own <em>perspective.</em>
              </h2>
              <a href="#/collection" className="primary-button">
                Explore the collection <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        )}

        {route === '/about' && (
          <div className="about-page">
            <div className="about-intro page-width">
              <span className="eyebrow">JIAN / OUR PHILOSOPHY</span>
              <div className="about-title">
                <h1>
                  The space
                  <br />
                  <em>between.</em>
                </h1>
                <span lang="zh" aria-hidden="true">
                  间
                </span>
              </div>
              <div className="about-description">
                <span className="eyebrow">JIĀN / 间 / BETWEEN, SPACE, INTERVAL</span>
                <p>
                  We are a contemporary clothing label shaped by two ways of seeing. The depth of
                  Chinese craft. The clarity of Scandinavian design. Not a fusion for its own sake,
                  but a natural conversation.
                </p>
                <p>
                  Founded between Shanghai and Copenhagen, JIAN makes clothes for a life in motion.
                  Considered pieces that carry a sense of where they come from, and leave space for
                  who you are.
                </p>
              </div>
            </div>
            <div className="about-image">
              <img
                src={assetUrl('images/campaign.png')}
                alt="Contemporary Chinese fashion and modern stone architecture in soft natural light"
                loading="lazy"
              />
            </div>
            <section className="about-principles page-width">
              <div>
                <span className="eyebrow">01 / ROOTS</span>
                <h2>
                  Heritage,
                  <br />
                  <em>without nostalgia.</em>
                </h2>
                <p>
                  A stand collar. An off-centre seam. A fold held in place. We draw from the
                  intelligence of traditional Chinese dress, translating its construction into a
                  contemporary vocabulary.
                </p>
              </div>
              <div>
                <span className="eyebrow">02 / RESTRAINT</span>
                <h2>
                  Simplicity,
                  <br />
                  <em>with soul.</em>
                </h2>
                <p>
                  We value the Scandinavian instinct for clarity and purpose. But simplicity should
                  feel human. Natural textures, generous proportions and quiet details bring warmth
                  to every piece.
                </p>
              </div>
              <div>
                <span className="eyebrow">03 / CONTINUITY</span>
                <h2>
                  Designed
                  <br />
                  <em>to stay.</em>
                </h2>
                <p>
                  We choose linen, silk, cotton and wool for their touch, their character and the
                  way they age. Our ambition is a considered wardrobe, built slowly and worn often.
                </p>
              </div>
            </section>
            <section className="about-closing page-width">
              <span lang="zh">不止于形</span>
              <p>Beyond form. Into feeling.</p>
              <a className="text-link" href="#/collection">
                Meet the first collection <ArrowUpRight size={18} />
              </a>
            </section>
          </div>
        )}

        {route === '/saved' && (
          <div className="page-width saved-page">
            <div className="page-heading">
              <span className="eyebrow">YOUR PERSONAL EDIT</span>
              <h1>
                Pieces to <em>return to.</em>
              </h1>
              <p>A little space for what stays with you.</p>
            </div>
            {saved.length ? (
              <div className="product-grid">
                {products.filter((p) => saved.includes(p.id)).map(card)}
              </div>
            ) : (
              <div className="empty-state">
                <Heart size={28} strokeWidth={1} />
                <p>Your edit is waiting to take shape.</p>
                <a href="#/collection" className="text-link">
                  Find your first piece <ArrowUpRight size={18} />
                </a>
              </div>
            )}
          </div>
        )}
        {!['/', '/collection', '/campaign', '/about', '/saved'].includes(route) &&
          !currentProduct && (
            <div className="page-width not-found">
              <span className="eyebrow">A LITTLE SPACE TO FIND YOUR WAY</span>
              <h1>
                This page has
                <br />
                moved <em>elsewhere.</em>
              </h1>
              <a href="#/" className="text-link">
                Return to JIAN <ArrowRight size={18} />
              </a>
            </div>
          )}
      </main>
      {footer}
      {toast && (
        <div className="toast" role="status">
          <Check size={16} />
          {toast}
        </div>
      )}

      {overlay === 'menu' && (
        <Modal title="JIAN / MENU" onClose={() => setOverlay(null)} className="menu-modal">
          <nav>
            <a href="#/collection" onClick={() => setOverlay(null)}>
              Collection <sup>01</sup>
              <ArrowUpRight />
            </a>
            <a href="#/campaign" onClick={() => setOverlay(null)}>
              Campaign <ArrowUpRight />
            </a>
            <a href="#/about" onClick={() => setOverlay(null)}>
              Philosophy <ArrowUpRight />
            </a>
            <a href="#/saved" onClick={() => setOverlay(null)}>
              Saved pieces <span>({saved.length})</span>
            </a>
          </nav>
          <span className="eyebrow">SHANGHAI · COPENHAGEN</span>
        </Modal>
      )}

      {overlay === 'search' && (
        <Modal title="FIND YOUR PIECE" onClose={() => setOverlay(null)} className="search-modal">
          <div className="search-input">
            <Search size={22} strokeWidth={1.5} />
            <input
              data-initial-focus
              type="search"
              aria-label="Search the collection"
              placeholder="A piece, a material, a feeling…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <p className="eyebrow search-results-label">
            {query ? 'THE COLLECTION / SEARCH RESULTS' : 'A FEW CONSIDERED PIECES'}
          </p>
          <div className="search-results">
            {products
              .filter((p) =>
                `${p.name} ${p.category} ${p.material} ${p.color}`
                  .toLowerCase()
                  .includes(query.toLowerCase().trim()),
              )
              .map((p) => (
                <a key={p.id} href={`#/product/${p.id}`} onClick={() => setOverlay(null)}>
                  <ProductImage product={p} />
                  <div>
                    <span>{p.name}</span>
                    <small>
                      {p.material} / {p.color}
                    </small>
                  </div>
                  <span>{money(p.price)}</span>
                  <ArrowUpRight size={18} />
                </a>
              ))}
          </div>
          {!products.some((p) =>
            `${p.name} ${p.category} ${p.material} ${p.color}`
              .toLowerCase()
              .includes(query.toLowerCase().trim()),
          ) && (
            <div className="empty-state">
              <p>No pieces found for “{query}”.</p>
              <button className="text-link" onClick={() => setQuery('')}>
                Explore all pieces <ArrowRight size={17} />
              </button>
            </div>
          )}
        </Modal>
      )}

      {overlay === 'bag' && (
        <Modal
          title={`YOUR BAG (${bagCount})`}
          onClose={() => setOverlay(null)}
          className="bag-modal"
        >
          {bagItems.length ? (
            <>
              <div className="bag-items">
                {bagItems.map((item) => (
                  <article className="bag-item" key={`${item.id}-${item.size}`}>
                    <a href={`#/product/${item.id}`} onClick={() => setOverlay(null)}>
                      <ProductImage product={item.product} />
                    </a>
                    <div>
                      <a href={`#/product/${item.id}`} onClick={() => setOverlay(null)}>
                        {item.product.name}
                      </a>
                      <p>
                        {item.product.color} / Size {item.size}
                      </p>
                      <span>{money(item.product.price)}</span>
                      <div className="quantity-controls">
                        <button
                          aria-label={`Decrease quantity of ${item.product.name}`}
                          onClick={() => changeQuantity(item.id, item.size, -1)}
                        >
                          <Minus size={13} />
                        </button>
                        <span aria-label="Quantity">{item.quantity}</span>
                        <button
                          aria-label={`Increase quantity of ${item.product.name}`}
                          onClick={() => changeQuantity(item.id, item.size, 1)}
                        >
                          <Plus size={13} />
                        </button>
                        <button
                          className="remove-item"
                          onClick={() =>
                            setBag((old) =>
                              old.filter((i) => !(i.id === item.id && i.size === item.size)),
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="bag-summary">
                <div>
                  <span>Subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>
                <p>
                  {subtotal >= 300
                    ? 'Your order qualifies for complimentary shipping.'
                    : `${money(300 - subtotal)} away from complimentary shipping.`}
                </p>
                <button
                  className="primary-button"
                  onClick={() => {
                    setOrderComplete(false);
                    setOverlay('checkout');
                  }}
                >
                  Continue to checkout <ArrowRight size={18} />
                </button>
                <span className="bag-preview-note">
                  Fictional brand preview. No payment will be taken.
                </span>
              </div>
            </>
          ) : (
            <div className="empty-state bag-empty">
              <span lang="zh" aria-hidden="true">
                间
              </span>
              <h2>
                A little room
                <br />
                for something <em>considered.</em>
              </h2>
              <p>Your bag is currently empty.</p>
              <a className="text-link" href="#/collection" onClick={() => setOverlay(null)}>
                Explore the collection <ArrowUpRight size={18} />
              </a>
            </div>
          )}
        </Modal>
      )}

      {overlay === 'checkout' && (
        <Modal
          title={orderComplete ? 'YOUR JIAN PREVIEW' : 'CHECKOUT / PREVIEW'}
          onClose={() => setOverlay(null)}
          className="checkout-modal"
        >
          {orderComplete ? (
            <div className="order-confirmation">
              <span className="confirmation-icon">
                <Check size={30} strokeWidth={1} />
              </span>
              <h2>
                A thoughtful
                <br />
                <em>choice.</em>
              </h2>
              <p>
                Your preview order is complete. No payment was taken and no order will be shipped.
              </p>
              <a className="text-link" href="#/collection" onClick={() => setOverlay(null)}>
                Return to the collection <ArrowUpRight size={18} />
              </a>
            </div>
          ) : (
            <>
              <button className="text-link checkout-back" onClick={() => setOverlay('bag')}>
                <ArrowLeft size={15} /> Back to your bag
              </button>
              <p className="checkout-intro">
                Experience the final step. This is a fictional brand preview; no payment or real
                order will be processed.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setOrderComplete(true);
                  setBag([]);
                }}
              >
                <div className="checkout-fields">
                  <label>
                    Full name
                    <input name="name" autoComplete="name" required placeholder="Your full name" />
                  </label>
                  <label>
                    Email address
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                    />
                  </label>
                  <label>
                    Address
                    <input
                      name="address"
                      autoComplete="street-address"
                      required
                      placeholder="Street and house number"
                    />
                  </label>
                  <div className="form-row">
                    <label>
                      City
                      <input name="city" autoComplete="address-level2" required />
                    </label>
                    <label>
                      Postal code
                      <input name="postal" autoComplete="postal-code" required />
                    </label>
                  </div>
                  <label>
                    Country
                    <select name="country" autoComplete="country-name" required defaultValue="">
                      <option value="" disabled>
                        Select a country
                      </option>
                      <option>Denmark</option>
                      <option>Sweden</option>
                      <option>Germany</option>
                      <option>France</option>
                      <option>Netherlands</option>
                      <option>China</option>
                      <option>United Kingdom</option>
                      <option>United States</option>
                      <option>Other</option>
                    </select>
                  </label>
                </div>
                <div className="checkout-totals">
                  <div>
                    <span>Subtotal</span>
                    <span>{money(subtotal)}</span>
                  </div>
                  <div>
                    <span>Shipping</span>
                    <span>{subtotal >= 300 ? 'Complimentary' : money(15)}</span>
                  </div>
                  <div className="checkout-total">
                    <span>Total</span>
                    <span>{money(subtotal + (subtotal >= 300 ? 0 : 15))}</span>
                  </div>
                </div>
                <button className="primary-button" type="submit">
                  Complete preview order <ArrowRight size={18} />
                </button>
              </form>
            </>
          )}
        </Modal>
      )}

      {overlay === 'size' && (
        <Modal title="FIND YOUR FIT" onClose={() => setOverlay(null)}>
          <h2>
            Room to be <em>yourself.</em>
          </h2>
          <p>
            Our silhouettes are intentionally relaxed. Measurements below refer to body measurements
            in centimetres. For a closer fit, consider one size down.
          </p>
          <div className="size-table-wrap">
            <table className="size-table">
              <caption>Body measurements (cm)</caption>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest</th>
                  <th>Waist</th>
                  <th>Hip</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['XS', '80–84', '62–66', '86–90'],
                  ['S', '84–90', '66–72', '90–96'],
                  ['M', '90–96', '72–78', '96–102'],
                  ['L', '96–102', '78–84', '102–108'],
                  ['XL', '102–108', '84–90', '108–114'],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) =>
                      i === 0 ? (
                        <th scope="row" key={i}>
                          {cell}
                        </th>
                      ) : (
                        <td key={i}>{cell}</td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small-note">
            For garment-specific proportions, see Fit & construction on each piece.
          </p>
        </Modal>
      )}
      {['shipping', 'care', 'contact', 'privacy'].includes(overlay) && (
        <Modal
          title={
            {
              shipping: 'SHIPPING & RETURNS',
              care: 'CARE, OVER TIME',
              contact: 'THE JIAN STUDIO',
              privacy: 'YOUR PRIVACY',
            }[overlay]
          }
          onClose={() => setOverlay(null)}
        >
          {overlay === 'shipping' && (
            <>
              <h2>
                A considered
                <br />
                <em>journey.</em>
              </h2>
              <p>
                Complimentary shipping on orders over €300. Standard shipping is €15. EU delivery
                takes 3–5 working days; international delivery takes 5–10 working days.
              </p>
              <p>
                We accept returns of unworn pieces within 30 days, with original labels and
                packaging. Keep your garments and their packaging in good condition while you
                decide.
              </p>
              <p className="small-note">
                JIAN is a fictional brand concept. The checkout is a preview and does not process
                payments or arrange delivery.
              </p>
            </>
          )}
          {overlay === 'care' && (
            <>
              <h2>
                Made to stay
                <br />
                <em>with you.</em>
              </h2>
              <p>
                Air your garments between wears. Brush wool gently, and rest it on a broad hanger.
                Fold knitwear and delicate silk to preserve their shape.
              </p>
              <p>
                Wash cotton and linen gently in cool water, using a mild detergent. Avoid tumble
                drying. We recommend professional cleaning for tailored wool and silk blends.
              </p>
              <p>
                Always follow the care instructions for your individual garment. Store in a cool,
                dry place away from direct light.
              </p>
            </>
          )}
          {overlay === 'contact' && (
            <>
              <h2>
                A conversation
                <br />
                <em>starts here.</em>
              </h2>
              <p>
                For collection questions, studio visits and press inquiries, leave a note for the
                JIAN studio.
              </p>
              <form
                className="contact-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setOverlay(null);
                  setToast('Thank you. Your preview note is complete.');
                }}
              >
                <label>
                  Email address
                  <input type="email" required autoComplete="email" placeholder="you@example.com" />
                </label>
                <label>
                  Your note
                  <textarea required rows="4" placeholder="What’s on your mind?" />
                </label>
                <p className="small-note">
                  Preview form. Messages are not sent to an external service.
                </p>
                <button className="primary-button" type="submit">
                  Leave a note <ArrowRight size={18} />
                </button>
              </form>
            </>
          )}
          {overlay === 'privacy' && (
            <>
              <h2>
                Your space,
                <br />
                <em>respected.</em>
              </h2>
              <p>
                This website is a fictional brand preview. Your bag, saved pieces and newsletter
                preference are kept in your browser. We do not use advertising cookies or send your
                checkout details to a server.
              </p>
              <p>You can remove locally saved preferences at any time.</p>
              <button
                className="text-link"
                onClick={() => {
                  setBag([]);
                  setSaved([]);
                  setNewsletterState('');
                  setEmail('');
                  try {
                    localStorage.removeItem('jian-newsletter');
                  } catch {
                    /* Storage unavailable. */
                  }
                  setToast('Your locally saved preferences have been cleared.');
                }}
              >
                Clear saved preferences <ArrowRight size={17} />
              </button>
            </>
          )}
        </Modal>
      )}
    </>
  );
}

export default App;
