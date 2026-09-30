import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  Check,
  Plus,
  Minus,
  Menu,
  X,
  Dumbbell,
  Monitor,
  House,
  Leaf,
  Activity,
  MoveUpRight,
  Camera as Instagram,
  Mail,
  Phone,
  Play,
  Pause,
  ShieldCheck,
  Heart,
  CalendarDays,
  Plane,
  MapPin,
  Mountain,
  TreePalm,
  ArrowLeft,
  Compass,
  Sun,
  LoaderCircle,
  Apple,
  Droplets,
  Moon,
  UserRound,
  ChartNoAxesColumnIncreasing,
  MessageCircle,
} from "lucide-react";
import {
  api,
  post,
  SiteContext,
  useSite,
  useAction,
  Status,
  Field,
  title,
  date,
  Entry,
} from "./lib";
import { policies } from "./policies";
import { LoginExperience } from "./login-experience";
import { Consultation } from "./consultation";
import { Admin, ClientDashboard } from "./workspace";
import "./styles.css";
import "./reference-theme.css";
import "./footer.css";
import "./contact-scene.css";
import "./about-coach.css";
import "./transformations-scene.css";
const icons: any = {
  dumbbell: Dumbbell,
  monitor: Monitor,
  home: House,
  leaf: Leaf,
  activity: Activity,
};
function Logo({ footer = false }: { footer?: boolean }) {
  const { data } = useSite();
  return (
    <Link className="brand" to="/" aria-label="Surya Fitness home">
      <img
        className="brand-logo"
        src={footer ? (data.settings.footerLogoImage || "/images/brand/surya-logo-white.png") : (data.settings.logoImage || "/images/brand/surya-logo-light.png")}
        alt="Surya Fitness — Fitness Coach & Personal Trainer"
        width={footer ? 2172 : 2171}
        height="724"
      />
    </Link>
  );
}

function Button({
  to,
  children,
  light = false,
  className = "",
  ...props
}: any) {
  return to ? (
    <Link to={to} className={`button ${light ? "light" : ""} ${className}`}>
      {children}
      <ArrowUpRight size={18} />
    </Link>
  ) : (
    <button
      className={`button ${light ? "light" : ""} ${className}`}
      {...props}
    >
      {children}
      <ArrowUpRight size={18} />
    </button>
  );
}
function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useSite();
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="site-header">
      <Logo />
      <nav aria-label="Main navigation" className={open ? "open" : ""}>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/meet-surya">About Surya</NavLink>
        <NavLink to="/programmes">Programmes</NavLink>
        <NavLink to="/transformations">Transformations</NavLink>
        <NavLink to="/journal">Blog</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <Link
          className="mobile-only"
          to={
            user ? (user.role === "client" ? "/dashboard" : "/admin") : "/login"
          }
        >
          {user ? "My dashboard" : "Client login"}
        </Link>
      </nav>
      <div className="header-actions">
        <Link
          className="login-link"
          to={
            user ? (user.role === "client" ? "/dashboard" : "/admin") : "/login"
          }
        >
          {user ? "My dashboard" : "Client login"}
        </Link>
        <Button to="/book" className="small">
          Let’s get started
        </Button>
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="icon-button menu-button"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
function Newsletter() {
  const a = useAction();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const b = Object.fromEntries(new FormData(form));
        a.run(() =>
          post("/leads", {
            ...b,
            source: "newsletter",
            contactConsent: true,
            marketing: true,
          }),
        ).then((r) => {
          if (r) form.reset();
        });
      }}
    >
      <div className="newsletter-row">
        <UserRound className="newsletter-person" size={23} aria-hidden="true" />
        <input
          name="name"
          aria-label="Your name"
          placeholder="Your name"
          required
        />
        <Mail className="newsletter-mail" size={23} aria-hidden="true" />
        <input
          name="email"
          aria-label="Email address"
          type="email"
          placeholder="Your email address"
          required
        />
        <button aria-label="Subscribe" disabled={a.busy}>
          <ArrowRight />
        </button>
      </div>
      <label className="checkline">
        <input required type="checkbox" />
        I’d like fitness updates. I can unsubscribe anytime.
      </label>
      <Status action={a} />
    </form>
  );
}
function Footer() {
  const { data, setCookieOpen } = useSite();
  return (
    <footer className="surya-footer">
      <div className="footer-atmosphere" aria-hidden="true"><img className="footer-portrait" src="/images/surya/hero-selected.png" alt="" loading="lazy"/><div className="footer-equipment"><img src="/images/surya/footer-reference.png" alt="" loading="lazy"/></div><div className="footer-planner"><img src="/images/surya/footer-reference.png" alt="" loading="lazy"/></div></div>
      <div className="footer-top wrap">
        <div className="footer-invitation">
          <p className="eyebrow">A LITTLE ENCOURAGEMENT IN YOUR INBOX <span/></p>
          <h2>Your next chapter,<br/><em>one note at a time.</em></h2>
          <p>Get fitness tips, simple nutrition ideas, travel stories and real talk — straight to your inbox.</p>
        </div>
        <Newsletter />
        <div className="footer-benefits">
          {[[Dumbbell,"Workout","tips & plans"],[Apple,"Nutrition","guidance"],[Heart,"Mindset","& motivation"],[ChartNoAxesColumnIncreasing,"Travel &","lifestyle stories"]].map(([Icon,first,last]:any)=><div key={first}><Icon size={30} strokeWidth={1.6}/><span>{first}<br/>{last}</span></div>)}
        </div>
        <div className="footer-script" aria-hidden="true">Stronger<br/><span>Every Day</span><Heart size={27}/></div>
      </div>
      <div className="footer-main wrap">
        <div className="footer-brand-block">
          <Logo footer />
          <p>Personal coaching. Practical habits.<br/>A stronger everyday.</p>
          <div className="social-links">
            {data.settings.instagram&&<a href={data.settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram/></a>}
            {data.settings.facebook&&<a href={data.settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><b aria-hidden="true" style={{fontSize:22}}>f</b></a>}
          </div>
        </div>
        <div>
          <strong>EXPLORE</strong>
          <Link to="/meet-surya">Meet Surya</Link>
          <Link to="/programmes">Coaching programmes</Link>
          <Link to="/consultation">Nutrition consultation</Link>
          <Link to="/transformations">Client stories</Link>
          <Link to="/journal">Fitness journal</Link>
          <Link to="/login">Client sign in</Link>
        </div>
        <div>
          <strong>LET’S CONNECT</strong>
          <Link to="/book">Book a consultation</Link>
          <Link to="/contact">Contact Surya</Link>
          <a href={`mailto:${data.settings.email}`}>{data.settings.email}</a>
          <a href={`tel:+${data.settings.whatsapp}`}>+{data.settings.whatsapp}</a>
        </div>
        <div className="footer-habits">
          <strong>HEALTHY HABITS<br/>HAPPIER YOU</strong>
          {[[Dumbbell,"Train"],[Apple,"Eat well"],[Droplets,"Stay hydrated"],[Moon,"Rest"],[Heart,"Repeat"]].map(([Icon,label]:any)=><p key={label}><Icon size={23} strokeWidth={1.6}/>{label}</p>)}
        </div>
      </div>
      <div className="footer-bottom wrap">
        <span>© {new Date().getFullYear()} Train with Surya</span>
        <div>{Object.entries(policies).map(([slug,p])=><Link key={slug} to={"/policies/"+slug}>{p.title.split(" policy")[0]}</Link>)}<button onClick={()=>setCookieOpen(true)}>Cookie preferences</button></div>
        <span className="footer-made">Made with <Heart size={17}/> for a stronger you.<a href="https://connectadda.com" target="_blank" rel="noreferrer">Powered by <b>Connect Adda ↗</b></a></span>
      </div>
    </footer>
  );
}

function Hero() {
  const { data } = useSite();
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPaused, setVideoPaused] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = ref.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          setProgress(
            Math.max(0, Math.min(1, -rect.top / (rect.height - innerHeight))),
          );
        }
      });
    };
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
    const onMotion = () => setReduced(mq.matches);
    mq.addEventListener("change", onMotion);
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
      cancelAnimationFrame(frame);
      mq.removeEventListener("change", onMotion);
    };
  }, []);
  const scene = reduced ? 0 : Math.min(2, Math.floor(progress * 3));
  const videoSource = data.settings.heroVideo || "";
  const videoActive = scene !== 1 && !reduced && !videoFailed;
  useEffect(() => {
    setVideoReady(false);
    setVideoFailed(false);
  }, [videoSource]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (videoActive && !videoPaused && inView && pageVisible) {
      video.play().catch(() => setVideoPlaying(false));
    } else video.pause();
  }, [videoActive, videoPaused, inView, pageVisible, videoSource]);
  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (videoPlaying) {
      setVideoPaused(true);
      video.pause();
    } else {
      setVideoPaused(false);
      video.play().catch(() => setVideoPlaying(false));
    }
  };
  const images = [
    data.settings.heroImage || "/images/surya/hero-blue.webp",
    data.settings.secondHeroImage || "/images/surya/hero-outdoor-original.jpeg",
    data.settings.thirdHeroImage || "/images/surya/hero-lifestyle-olive.webp",
  ];
  return (
    <section ref={ref} className={`reference-hero ${scene === 1 ? "scene-outdoor" : scene === 2 ? "scene-outdoor scene-lifestyle" : ""} ${reduced ? "reduced" : ""}`}>
      <div className="reference-hero-sticky">
        <div className="reference-art" aria-hidden="true">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              className={scene === i ? "active" : ""}
              alt=""
              fetchPriority={i === 0 ? "high" : "auto"}
            />
          ))}
          {videoSource && !reduced && !videoFailed && (
            <video
              ref={videoRef}
              className={`hero-workout-video ${videoActive && videoReady ? "active" : ""}`}
              src={videoSource}
              poster={images[0]}
              muted
              loop
              playsInline
              preload="metadata"
              onLoadedData={() => setVideoReady(true)}
              onPlaying={() => setVideoPlaying(true)}
              onPause={() => setVideoPlaying(false)}
              onError={() => {
                setVideoFailed(true);
                setVideoPlaying(false);
              }}
              tabIndex={-1}
            />
          )}
        </div>
        <div className="reference-veil" />
        <div className="reference-pattern" aria-hidden="true" />
        {videoSource && videoActive && (
          <button
            type="button"
            className="hero-motion-toggle"
            onClick={toggleVideo}
            aria-label={
              videoPlaying
                ? "Pause hero workout video"
                : "Play hero workout video"
            }
          >
            {videoPlaying ? <Pause size={15} /> : <Play size={15} />}
            {videoPlaying ? "Pause motion" : "Play motion"}
          </button>
        )}
        <div className="reference-watermark" aria-hidden="true">
          SURYA
        </div>
        <div className="wrap reference-content">
          <div className="reference-copy">
            {data.settings.hero.map((h: Entry, i: number) => (
              <div
                key={i}
                className={`reference-scene ${scene === i ? "current" : ""}`}
                aria-hidden={scene !== i}
                inert={scene !== i}
              >
                <p className="eyebrow">{h.eyebrow}</p>
                <h1>
                  {h.title.split("\n").map((line: string, j: number) => (
                    <React.Fragment key={j}>
                      {j > 0 && <br />}
                      {j === h.title.split("\n").length - 1 ? (
                        <span>{line}</span>
                      ) : (
                        line
                      )}
                    </React.Fragment>
                  ))}
                </h1>
                <p className="reference-description">{h.text}</p>
                <div className="reference-buttons">
                  <Button to={h.href}>{h.cta}</Button>
                  <Link to="/meet-surya" className="text-link">
                    Meet Surya <ArrowRight size={19} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="reference-facts">
            <div>
              <strong>1:1</strong>
              <span>Personal guidance</span>
            </div>
            <div>
              <strong>Your pace</strong>
              <span>A plan that fits your life</span>
            </div>
            <div>
              <strong>Online +</strong>
              <span>At home. In person.</span>
            </div>
          </div>
          <div className="reference-pillars">
            {[
              [Dumbbell, "Strength", "Training"],
              [Leaf, "Nutrition", "Guidance"],
              [Compass, "Consistent", "Habits"],
              [Heart, "Healthier", "Lifestyle"],
            ].map(([Icon, a, b]: any) => (
              <div key={a}>
                <span>
                  <Icon size={21} />
                </span>
                <p>
                  {a}
                  <br />
                  {b}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="reference-handwriting" aria-hidden="true">
          {scene === 1 ? <>Progress<br />Looks Good<br />On You</> : <>Stronger<br />Healthier<br />Happier You</>} <Heart size={32} />
        </div>
        <div className="reference-bottom wrap">
          <div className="scene-dots">
            {["YOUR STRENGTH", "YOUR COACH", "YOUR WAY"].map((t, i) => (
              <span key={t} className={scene === i ? "selected" : ""}>
                <b>0{i + 1}</b>
                <span>{t}</span>
              </span>
            ))}
          </div>
          <span className="reference-motto">
            DISCIPLINE TODAY. A STRONGER TOMORROW.
          </span>
          <ChevronDown size={17} />
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, heading, sub, link }: any) {
  return (
    <div className="section-heading reveal">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{heading}</h2>
        {sub && <p className="section-sub">{sub}</p>}
      </div>
      {link && (
        <Link to={link.to} className="text-link">
          {link.text}
          <ArrowUpRight size={18} />
        </Link>
      )}
    </div>
  );
}
function ProgrammeCard({ p, index, referencePhoto = false }: any) {
  const Icon = icons[p.icon] || Dumbbell;
  return (
    <Link
      to={"/programmes/" + p.id}
      className={`programme-card ${p.color || "sage"} reveal`}
    >
      <div className="card-top">
        <span>0{index + 1}</span>
        <ArrowUpRight />
      </div>
      <div className={`programme-photo ${referencePhoto ? "supplied-programme-photo supplied-photo-" + index : ""}`}>
        <img
          src={
            referencePhoto ? "/images/surya/programmes-reference.png" : p.image ||
            (["nutrition-support", "online-coaching"].includes(p.id)
              ? "/images/surya/coach-blue.webp"
              : "/images/surya/hero-blue.webp")
          }
          alt={"Surya Singh — " + title(p.title)}
          loading="lazy"
        />
        <div className="programme-photo-label">
          <Icon size={21} />
          <span>{p.category}</span>
        </div>
      </div>
      <p className="eyebrow">{p.label}</p>
      <h3>{p.title}</h3>
      <p>{p.summary}</p>
      <span className="card-link">
        Explore programme <ArrowRight size={17} />
      </span>
    </Link>
  );
}
function HomeSection({ section }: any) {
  const { data } = useSite();
  if (!section.enabled) return null;
  const common = { heading: section.title, sub: section.subtitle };
  if (section.id === "programmes")
    return (
      <section className="section programmes-reference-section" id="programmes">
        <div className="programmes-portrait-watermark" aria-hidden="true"><img src="/images/surya/coach-watermark.png" alt="" loading="lazy" /></div>
        <div className="wrap">
        <SectionHeading
          heading={<>{section.title.split("\n")[0]}<br /><span>{section.title.split("\n").slice(1).join(" ")}</span></>}
          sub={section.subtitle}
          eyebrow="FIND YOUR WAY FORWARD"
        />
        <div className="programme-grid">
          {data.programmes.slice(0, 3).map((p: Entry, i: number) => (
            <ProgrammeCard key={p.id} p={p} index={i} referencePhoto />
          ))}
        </div>
        <div className="programmes-bottom"><span className="programmes-motto">STRONG BODY. CLEAR MIND. CONFIDENT YOU.</span><div className="under-note">
          Not sure where to start?{" "}
          <Link to="/finder">
            Let’s find your fit <ArrowRight size={18} />
          </Link>
        </div></div></div>
      </section>
    );
  if (section.id === "about")
    return (
      <section className="about-section coach-reference-section" id="meet-your-coach">
        <div className="coach-section-watermark" aria-hidden="true">SURYA</div>
        <div className="wrap about-grid">
          <div className="about-photo supplied-coach-photo reveal">
            <img loading="lazy" src="/images/surya/coach-section-reference.png" alt="Surya Singh, fitness coach and personal trainer, seated in a blue shirt in the gym" />
          </div>
          <div className="about-copy reveal">
            <img className="coach-person-watermark" src="/images/surya/coach-watermark.png" alt="" aria-hidden="true" loading="lazy" />
            <p className="eyebrow">MEET YOUR COACH</p>
            <h2>{section.title.split("\n")[0]}<br /><span>{section.title.split("\n").slice(1).join(" ")}</span></h2>
            <p>{data.settings.aboutText}</p>
            <div className="coach-values">
              <span><Dumbbell /><span>Empathy<br />First</span></span>
              <span><Leaf /><span>Strength<br />for Life</span></span>
              <span><Heart /><span>Your<br />Own Pace</span></span>
            </div>
            <Button to="/meet-surya">A little more about Surya</Button>
            <div className="coach-note" aria-hidden="true">Stronger<br />Healthier<br />Happier You <Heart size={27} /></div>
          </div>
        </div>
        <div className="wrap coach-section-bottom"><span>DISCIPLINE TODAY. A STRONGER TOMORROW.</span><span>FITNESS · NUTRITION · MINDSET · LIFESTYLE</span></div>
      </section>
    );
  if (section.id === "method")
    return (
      <section className="section method approach-reference" id="surya-approach">
        <div className="approach-portrait"><img src="/images/surya/approach-cutout.png" alt="Surya smiling in her original mirror selfie" loading="lazy" /></div>
        <div className="wrap approach-content">
        <SectionHeading heading={<>{section.title.split("\n")[0]}<br /><span>{section.title.split("\n").slice(1).join(" ")}</span></>} sub={section.subtitle} eyebrow="THE SURYA APPROACH" />
        <div className="method-grid">
          {[
            [
              "01",
              "Let’s talk about you",
              "Your goals, your routine and what’s been getting in the way.",
            ],
            [
              "02",
              "Find your starting point",
              "A coaching format that meets you where you are.",
            ],
            [
              "03",
              "Build your rhythm",
              "Clear guidance and practical steps you can follow.",
            ],
            [
              "04",
              "Keep moving forward",
              "Check in, celebrate progress and adjust together.",
            ],
          ].map(([n, t, b]) => (
            <div className="method-step reveal" key={n}>
              <span>
                {n}
                <ArrowRight size={20} />
              </span>
              <h3>{t}</h3>
              <p>{b}</p>
            </div>
          ))}
        </div>
        </div>
        <div className="wrap approach-footer">DISCIPLINE TODAY. A STRONGER TOMORROW.</div>
      </section>
    );
  if (section.id === "transformations")
    return (
      <section className="progress-section progress-reference" id="progress">
        <div className="progress-orbit" aria-hidden="true" />
        <div className="progress-gym-watermarks" aria-hidden="true"><span className="progress-brand-mark">SURYA</span><div className="progress-rack"><i /><i /><i /></div><Dumbbell className="progress-weight-mark" /><span className="progress-wall-motto">DISCIPLINE<br />CREATES<br />FREEDOM</span><span className="progress-side-words">FITNESS<br />NUTRITION<br />MINDSET<br />LIFESTYLE</span></div>
        <div className="progress-portrait"><img src="/images/surya/progress-cutout.png" alt="Surya Singh wearing an olive dress, smiling in a mirror selfie" loading="lazy" /></div>
        <div className="wrap progress-content">
          <SectionHeading heading={<>{section.title.split("\n")[0]}<br /><span>{section.title.split("\n").slice(1).join(" ")}</span></>} sub={section.subtitle} eyebrow="MORE THAN BEFORE & AFTER" />
          {data.stories.length ? (
            <StoryCards stories={data.stories} />
          ) : (
            <div className="progress-values">
              {[
                [
                  "Strength",
                  "Doing something today that once felt out of reach.",
                ],
                [
                  "Consistency",
                  "Finding a rhythm you can return to, even on busy days.",
                ],
                [
                  "Confidence",
                  "Feeling more at home in what your body can do.",
                ],
              ].map(([h, p]) => (
                <div key={h} className="reveal">
                  <span className="progress-mark">{h === "Strength" ? <Dumbbell /> : h === "Consistency" ? <CalendarDays /> : <Heart />}</span>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          )}
          <div className="progress-bottom">
            <p>Your starting point is welcome here.</p>
            <Button light to="/book">
              Let’s talk about your goals
            </Button>
          </div>
        </div>
        <div className="wrap progress-footer">DISCIPLINE TODAY. A STRONGER TOMORROW.</div>
      </section>
    );
  if (section.id === "journal")
    return data.articles.length ? (
      <section className="section wrap">
        <SectionHeading
          {...common}
          eyebrow="THE FITNESS JOURNAL"
          link={{ to: "/journal", text: "Explore the journal" }}
        />
        <ArticleCards articles={data.articles.slice(0, 3)} />
      </section>
    ) : null;
  if (section.id === "social")
    return (
      <section className="travel-section" id="life-beyond">
        <div className="travel-decor" aria-hidden="true">
          <svg className="travel-flight-path" viewBox="0 0 650 150"><path d="M20 125 C-5 35 155 150 218 65 S330 18 285 53 S430 105 600 18" /></svg>
          <Plane className="travel-plane" /><Mountain className="travel-mountains" /><TreePalm className="travel-palm" />
        </div>
        <div className="wrap travel-layout">
          <div className="travel-copy">
            <p className="eyebrow">TRAVEL · FITNESS · GOOD FOOD · REAL LIFE</p>
            <p className="travel-kicker">SAME GIRL. DIFFERENT PLACES.</p>
            <h2>Life beyond<br />the <span>workout.</span></h2>
            <p>Exploring new places, finding balance, and staying consistent — because growth happens everywhere.</p>
            <a className="button" href={data.settings.instagram} target="_blank" rel="noreferrer">Follow My Journey <ArrowUpRight size={19} /></a>
            <div className="travel-values"><span><Dumbbell />Fitness<br />anywhere</span><span><Leaf />Better<br />food choices</span><span><Heart />Happier<br />you</span></div>
            <p className="travel-note">Collect experiences,<br />not excuses.</p>
          </div>
          <div className="travel-gallery">
            {(data.settings.travelCards || []).map((card: Entry,i: number)=>(
              <a className={`travel-card ${i===0 ? "travel-feature" : ""}`} key={i} href={data.settings.instagram} target="_blank" rel="noreferrer">
                <img src={card.image} alt={"Surya — "+card.location} loading="lazy" />
                <span className="travel-place"><MapPin size={16} />{card.location}</span>
                <span className="travel-caption">{card.caption}<ArrowUpRight size={20} /></span>
              </a>
            ))}
          </div>
        </div>
        <div className="wrap travel-footer">SAME GOALS. NEW HORIZONS.<span /> DIFFERENT PLACES. SAME YOU.</div>
      </section>
    );
  return null;
}
function Home() {
  const { data } = useSite();
  return (
    <>
      <Hero />
      <div className="belief-strip">
        <span>PERSONAL GUIDANCE</span>
        <span>✳</span>
        <span>PRACTICAL HABITS</span>
        <span>✳</span>
        <span>STRONGER EVERYDAY</span>
        <span>✳</span>
        <span>YOUR KIND OF FITNESS</span>
      </div>
      {data.settings.sections.map((s: Entry) => (
        <HomeSection key={s.id} section={s} />
      ))}
      <StartBanner />
    </>
  );
}
function StartBanner() {
  return (
    <section className="chapter-section">
      <div className="wrap chapter-panel">
        <div className="chapter-copy">
          <p className="eyebrow">YOU DON’T HAVE TO FIGURE IT OUT ALONE.</p>
          <h2>Ready for your<br /><em>stronger chapter?</em></h2>
          <p>Whether it’s fitness, nutrition, mindset or lifestyle — one conversation can bring clarity and direction. Let’s make your goals a plan.</p>
          <div className="chapter-benefits">
            {[[Dumbbell,"Personalised guidance"],[Leaf,"Sustainable nutrition"],[Heart,"Mindset support"],[Sun,"A healthier you"]].map(([Icon,label]: any)=><div key={label}><span><Icon /></span><p>{label}</p></div>)}
          </div>
          <Button to="/book">Let’s take the first step</Button>
        </div>
        <div className="chapter-photo"><img src="/images/surya/chapter-reference.png" alt="Surya in a red dress by the sea" loading="lazy" /></div>
        <div className="chapter-aside"><p className="chapter-handwriting">Same you.<br />Stronger you.</p><div><MapPin /><span>Exploring<br /><strong>New Places</strong></span></div><div><Heart /><span>Building<br /><strong>Healthy Habits</strong></span></div><div><Sun /><span>A Happier,<br /><strong>Stronger Me</strong></span></div></div>
        <div className="chapter-stamp" aria-hidden="true"><Plane /><span>NEW CHAPTER</span></div>
        <TreePalm className="chapter-palm" aria-hidden="true" />
      </div>
      <div className="wrap chapter-footer"><span><MessageCircle />Real conversations</span><span><Activity />Real progress</span><span>A stronger, happier you</span></div>
    </section>
  );
}
function PageIntro({ label, title: heading, text, children }: any) {
  return (
    <div className="page-intro wrap">
      <p className="eyebrow">{label}</p>
      <h1>{heading}</h1>
      {text && <p>{text}</p>}
      {children}
    </div>
  );
}
function Meet() {
  const { data } = useSite();
  return <>
    <section className="about-coach-scene">
      <div className="about-coach-photo" role="img" aria-label="Surya Singh wearing her blue trainer polo in a gym"><img src="/images/surya/about-trainer-reference.png" alt="" /></div>
      <div className="about-coach-copy">
        <p className="eyebrow">MEET SURYA SINGH</p>
        <h1>Your goals deserve<br />a coach <em>who gets it.</em></h1>
        <p className="about-coach-role">FITNESS COACH • PERSONAL TRAINER • LIFESTYLE MENTOR</p>
        <p>Surya believes fitness should make your life better, not take it over. Her approach combines structured training, practical nutrition and consistent habits that can actually fit into everyday life.</p>
        <p>As a fitness coach and personal trainer, she focuses on understanding where you are today, what you want to achieve and then building a realistic path forward.</p>
        <span className="about-coach-rule" aria-hidden="true" />
        <h2>A stronger chapter, built one day at a time.</h2>
        <p>{data.settings.aboutText || "For Surya, progress isn’t only about weight or measurements. It’s about becoming stronger, moving better, building confidence and creating habits you can sustain."}</p>
        <Button to="/contact">Start a conversation</Button>
      </div>
      <div className="about-coach-side" aria-hidden="true">HEALTHIER • HAPPIER • STRONGER YOU</div>
      <div className="about-coach-signature" aria-hidden="true">Surya<span>FITNESS<br />MINDSET<br />DISCIPLINE<br />BALANCE</span></div>
    </section>
    <section className="about-coach-expect">
      <p className="eyebrow">WHAT YOU CAN EXPECT</p>
      <h2>A coach in your corner.</h2>
      <div className="about-coach-values">{[
        ["Personal Guidance", "Training built around you."],
        ["Practical Nutrition", "Better choices without extremes."],
        ["Consistency", "Small steps you can repeat."],
        ["Real Progress", "Stronger body. Stronger mindset."],
      ].map(([title, text]) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}</div>
      <span className="about-coach-note" aria-hidden="true">REAL PEOPLE<br />REAL PROGRESS</span>
    </section>
    {data.credentials.length > 0 && <section className="wrap section"><SectionHeading eyebrow="COACHING BACKGROUND" heading="Experience behind the guidance." />{data.credentials.map((c: Entry) => <div className="credential" key={c.id}><ShieldCheck /><div><strong>{c.title}</strong><p>{c.issuer} · {c.date}</p>{c.source && <a href={c.source} target="_blank" rel="noreferrer">View source ↗</a>}</div></div>)}</section>}
  </>;
}
function Programmes() {
  const { data } = useSite();
  const [filter, setFilter] = useState("All");
  return (
    <>
      <PageIntro
        label="YOUR KIND OF COACHING"
        title={
          <>
            Find your fit.
            <br />
            Build your strong.
          </>
        }
        text="Personal support, in the format that makes sense for you."
      />
      <section className="wrap section compact">
        <div className="filter-row">
          {[
            "All",
            "One-to-One",
            "Online",
            "At Home",
            "Weight Management",
            "Nutrition",
          ].map((x) => (
            <button
              className={filter === x ? "active" : ""}
              onClick={() => setFilter(x)}
              key={x}
            >
              {x}
            </button>
          ))}
        </div>
        <div className="programme-grid all">
          {data.programmes
            .filter((p: Entry) => filter === "All" || p.category === filter)
            .map((p: Entry, i: number) => (
              <ProgrammeCard key={p.id} p={p} index={i} />
            ))}
        </div>
        <div className="under-note">
          A little guidance choosing?{" "}
          <Link to="/finder">Try the programme finder ↗</Link>
        </div>
      </section>
      <StartBanner />
    </>
  );
}
function ProgrammeDetail() {
  const { id } = useParams();
  const { data, user } = useSite();
  const p = data.programmes.find((x: Entry) => x.id === id);
  const a = useAction();
  if (!p) return <NotFound />;
  const Icon = icons[p.icon] || Dumbbell;
  return (
    <>
      <PageIntro label={p.label} title={title(p.title)} text={p.summary}>
        <Link to="/programmes" className="text-link">
          <ArrowLeft size={16} /> All programmes
        </Link>
      </PageIntro>
      <section className="wrap detail-grid">
        <div className="prose">
          <div className="programme-detail-photo">
            <img
              src={
                p.image ||
                (["nutrition-support", "online-coaching"].includes(p.id)
                  ? "/images/surya/coach-blue.webp"
                  : "/images/surya/hero-blue.webp")
              }
              alt={"Surya Singh — " + title(p.title)}
            />
          </div>
          <h2>
            Build a routine
            <br />
            you can come back to.
          </h2>
          <p>{p.description}</p>
          <h3>What’s included</h3>
          <ul className="inclusion-list">
            {(p.inclusions || []).map((x: string) => (
              <li key={x}>
                <Check size={18} />
                {x}
              </li>
            ))}
          </ul>
          <h3>Who it’s for</h3>
          <p>{p.suitable}</p>
          <h3>Your questions, answered</h3>
          {(p.faq || []).map((f: Entry) => (
            <details key={f.question}>
              <summary>
                {f.question}
                <Plus size={18} />
              </summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>
        <aside className="booking-card">
          <span className="eyebrow">LET’S FIND YOUR STARTING POINT</span>
          <h3>
            Your plan.
            <br />
            Built around you.
          </h3>
          {[
            ["Format", p.mode],
            ["Duration", p.duration],
            ["Sessions", p.frequency],
            ["Equipment", p.equipment],
            ["Support", p.support],
          ].map(([h, v]) => (
            <div className="fact" key={h}>
              <span>{h}</span>
              <strong>{v}</strong>
            </div>
          ))}
          <h3>
            {p.price
              ? `₹${Number(p.price).toLocaleString("en-IN")}`
              : "Enquire for details"}
          </h3>
          <Button to={"/book?programme=" + p.id}>Discuss this programme</Button>
          {p.price && (
            <button
              className="button outline"
              onClick={() => {
                if (!user) {
                  location.href = "/login";
                  return;
                }
                a.run(async () => {
                  const d = await post("/payments/order", { programme: p.id });
                  if (!(window as any).Razorpay) {
                    await new Promise((resolve, reject) => {
                      const script = document.createElement("script");
                      script.src =
                        "https://checkout.razorpay.com/v1/checkout.js";
                      script.onload = resolve;
                      script.onerror = reject;
                      document.body.append(script);
                    });
                  }
                  new (window as any).Razorpay({
                    key: d.key,
                    order_id: d.order.id,
                    amount: d.order.amount,
                    currency: "INR",
                    name: "Train with Surya",
                    prefill: { name: d.name, email: d.email },
                    handler: () =>
                      a.setSuccess(
                        "Payment submitted. Your dashboard will show the verified status.",
                      ),
                  }).open();
                  return {
                    message: "Complete checkout in the payment window.",
                  };
                });
              }}
            >
              Pay for programme <ArrowUpRight size={16} />
            </button>
          )}
          <Status action={a} />
          <small>
            Programme details and availability are confirmed before enrolment.
          </small>
        </aside>
      </section>
    </>
  );
}
function Finder() {
  const { data } = useSite();
  const [step, setStep] = useState(0),
    [answers, setAnswers] = useState<any>({}),
    [result, setResult] = useState<any>(null);
  const a = useAction();
  const questions = [
    [
      "goal",
      "What would you like to work on?",
      [
        "Build strength",
        "Weight management",
        "Nutrition habits",
        "Build consistency",
      ],
    ],
    ["location", "Where do you prefer to train?", ["Home", "Gym", "Flexible"]],
    [
      "experience",
      "What’s your starting point?",
      ["New to training", "Returning after a break", "Training regularly"],
    ],
    [
      "time",
      "How much time can you make for a session?",
      ["Under 30 minutes", "30–45 minutes", "45+ minutes"],
    ],
    [
      "equipment",
      "What equipment is available?",
      ["No equipment", "Basic home equipment", "Full gym"],
    ],
    [
      "format",
      "What kind of support feels right?",
      ["One-to-one coaching", "Online coaching", "Help me decide"],
    ],
  ] as [string, string, string[]][];
  const [k, q, opts] = questions[step];
  return (
    <section className="finder wrap">
      <Link to="/programmes" className="text-link">
        <ArrowLeft size={16} /> Back to programmes
      </Link>
      <div className="finder-box">
        <p className="eyebrow">FIND YOUR STARTING POINT</p>
        {result ? (
          <>
            <h1>
              A little direction.
              <br />
              Your next step.
            </h1>
            <p>{result.reason}</p>
            <div className="finder-results">
              {result.programmes.map((p: Entry) => (
                <div key={p.id}>
                  <h3>{title(p.title)}</h3>
                  <p>{p.summary}</p>
                  <Button to={"/book?source=finder&programme=" + p.id}>
                    Talk to Surya
                  </Button>
                </div>
              ))}
            </div>
            <button
              className="text-link"
              onClick={() => {
                setResult(null);
                setStep(0);
              }}
            >
              Start again
            </button>
          </>
        ) : (
          <>
            <div className="progress-bar">
              <span style={{ width: `${((step + 1) / 6) * 100}%` }} />
            </div>
            <span className="muted">QUESTION {step + 1} OF 6</span>
            <h2>{q}</h2>
            <div className="choice-grid">
              {opts.map((o) => (
                <button
                  className={answers[k] === o ? "selected" : ""}
                  key={o}
                  onClick={() => setAnswers({ ...answers, [k]: o })}
                >
                  {o}
                  <span>
                    {answers[k] === o ? (
                      <Check size={18} />
                    ) : (
                      <Plus size={18} />
                    )}
                  </span>
                </button>
              ))}
            </div>
            <div className="finder-controls">
              <button
                className="text-link"
                disabled={step === 0}
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft size={16} /> Back
              </button>
              <Button
                disabled={!answers[k] || a.busy}
                onClick={() =>
                  step < 5
                    ? setStep(step + 1)
                    : a
                        .run(() => post("/finder", answers))
                        .then((r) => {
                          if (r) setResult(r);
                        })
                }
              >
                {step === 5 ? "Find my fit" : "Next step"}
              </Button>
            </div>
          </>
        )}
        <Status action={a} />
        <small>
          No email needed. This matches coaching formats, not medical needs.
        </small>
      </div>
    </section>
  );
}
function EnquiryForm({ booking = false, compact = false }: any) {
  const { data } = useSite();
  const [slots, setSlots] = useState<any>({ slots: [], mode: "request" });
  const a = useAction();
  const [done, setDone] = useState(false);
  const query = new URLSearchParams(location.search);
  useEffect(() => {
    if (booking)
      api("/slots")
        .then(setSlots)
        .catch(() => {});
  }, [booking]);
  return done ? (
    <div className="form-success">
      <span>
        <Check size={32} />
      </span>
      <h2>
        Your first step,
        <br />
        taken.
      </h2>
      <p>{a.success}</p>
      <p>Surya will follow up using the contact details you shared.</p>
      <Button to="/programmes">Explore your options</Button>
    </div>
  ) : (
    <form
      className="enquiry-form"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget,
          b: any = Object.fromEntries(new FormData(form));
        b.contactConsent = b.contactConsent === "on";
        b.marketing = b.marketing === "on";
        b.source = query.get("source") || "inquiry";
        b.requestKey =
          sessionStorage.getItem("booking-key") || crypto.randomUUID();
        sessionStorage.setItem("booking-key", b.requestKey);
        a.run(() => post(booking ? "/bookings" : "/leads", b)).then((r) => {
          if (r) {
            setDone(true);
            sessionStorage.removeItem("booking-key");
          }
        });
      }}
    >
      <div className="form-grid">
        <Field label="Your name">
          <input
            name="name"
            required
            autoComplete="name"
            placeholder="What should we call you?"
          />
        </Field>
        <Field label="Email address">
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Phone / WhatsApp">
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="Your contact number"
          />
        </Field>
        <Field label="City">
          <input
            name="city"
            autoComplete="address-level2"
            placeholder="Where are you based?"
          />
        </Field>
        <Field label={compact ? "How can I help you?" : "I’m interested in"}>
          <select name="programme" defaultValue={query.get("programme") || ""}>
            <option value="">Help me choose</option>
            {data.programmes.map((p: Entry) => (
              <option key={p.id} value={p.id}>
                {title(p.title)}
              </option>
            ))}
          </select>
        </Field>
        {!compact && <Field label="Preferred coaching format">
          <select name="format">
            <option>Help me decide</option>
            <option>Online</option>
            <option>In-person</option>
            <option>At home</option>
          </select>
        </Field>}
      </div>
      {!compact && (booking && slots.mode === "slots" && slots.slots.length > 0 ? (
        <Field
          label={`Choose a consultation time (${Intl.DateTimeFormat().resolvedOptions().timeZone})`}
        >
          <select name="slot" required>
            <option value="">Select available time</option>
            {slots.slots.map((s: Entry) => (
              <option key={s.id} value={s.id}>
                {date(s.start)}
              </option>
            ))}
          </select>
        </Field>
      ) : (
        <Field label="When is a good time to reach you?">
          <input
            name="preferred"
            placeholder="For example, weekday evenings after 6 pm"
          />
        </Field>
      ))}
      <Field label={compact ? "Your message (optional)" : "A little about your goals (optional)"}>
        <textarea
          name="message"
          rows={4}
          placeholder="What would you like to work towards? Please keep medical details for private onboarding."
          maxLength={1000}
        />
      </Field>
      <input
        className="honeypot"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <label className="checkline">
        <input type="checkbox" name="contactConsent" required />I agree to be
        contacted about this enquiry and have read the{" "}
        <Link to="/policies/privacy">privacy policy</Link>.
      </label>
      <label className="checkline">
        <input type="checkbox" name="marketing" />
        Send me occasional fitness updates. I can unsubscribe anytime.
      </label>
      <Button disabled={a.busy}>
        {a.busy
          ? "Sending…"
          : booking
            ? "Request my consultation"
            : "Send my message"}
      </Button>
      <Status action={a} />
      <small>
        {booking
          ? "Preferred times are requests until confirmed. No payment is taken by this form."
          : "Your details are used to respond to your enquiry."}
      </small>
    </form>
  );
}
function Book({ contact = false }: any) {
  const { data } = useSite();
  if(contact) return <section className="contact-scene">
    <div className="contact-scene-art" aria-hidden="true"><img src="/images/surya/contact-reference.png" alt=""/></div>
    <div className="contact-scene-rings" aria-hidden="true"/>
    <div className="contact-scene-copy"><p className="eyebrow">LET’S CONNECT</p><h1>A question?<br/><em>Let’s talk.</em></h1><span className="contact-scene-rule"/><p>Tell me a little about you<br/>and where you’d like to go.</p><div className="contact-scene-signature" aria-hidden="true">Same You.<br/><span>Stronger</span><br/>Tomorrow.</div></div>
    <p className="contact-scene-motto" aria-hidden="true">DISCIPLINE<br/>CREATES<br/>FREEDOM<span/></p>
    <div className="contact-scene-panel"><header><h2>Send an Enquiry</h2><span>YOUR GOALS. OUR CONVERSATION.</span></header><EnquiryForm compact/></div>
    <div className="contact-scene-baseline"><span>DISCIPLINE • PROGRESS • FREEDOM</span><span>A HEALTHIER,<br/>HAPPIER YOU</span></div>
  </section>;

  return (
    <>
      <PageIntro
        label={contact ? "LET’S CONNECT" : "ONE CONVERSATION. A NEW START."}
        title={
          contact ? (
            <>
              A question?
              <br />
              Let’s talk.
            </>
          ) : (
            <>
              Your goals.
              <br />
              Let’s talk about them.
            </>
          )
        }
        text="You don’t need to have it all figured out. Tell Surya a little about where you are and where you’d like to go."
      />
      {!contact && <div className="wrap consultation-promo"><div><h3>Make your consultation personal.</h3><p>Save your goals, measurements and food routine in your private coaching space.</p></div><Link to="/consultation" className="button">Start consultation <ArrowUpRight size={18}/></Link></div>}
      <div className="wrap contact-grid">
        <aside>
          <div className="contact-note">
            <Sun size={34} strokeWidth={1.5} />
            <h3>
              A little clarity goes
              <br />a long way.
            </h3>
            <p>
              We’ll explore your goals, your routine and the kind of support
              that works for you.
            </p>
            <ul className="inclusion-list">
              <li>
                <Check size={16} /> Your starting point is welcome.
              </li>
              <li>
                <Check size={16} /> No pressure to have all the answers.
              </li>
              <li>
                <Check size={16} /> A plan begins with understanding.
              </li>
            </ul>
          </div>
          <a className="contact-line" href={"mailto:" + data.settings.email}>
            <Mail />
            <span>
              Email Surya<strong>{data.settings.email}</strong>
            </span>
          </a>
          <a
            className="contact-line"
            href={
              "https://wa.me/" +
              data.settings.whatsapp +
              "?text=" +
              encodeURIComponent(
                "Hi Surya, I came through your website and would like to know more about your coaching programmes.",
              )
            }
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle />
            <span>
              WhatsApp / Phone<strong>+91 82993 75609</strong>
            </span>
          </a>
          <p className="muted">
            In-person locations and programme availability are confirmed during
            your enquiry.
          </p>
        </aside>
        <EnquiryForm booking={!contact} />
      </div>
    </>
  );
}
function StoryCards({ stories }: any) {
  return (
    <div className="article-grid">
      {stories.map((s: Entry) => (
        <Link
          key={s.id}
          to={"/transformations/" + s.id}
          className="article-card"
        >
          {s.image && <img src={s.image} alt={s.title} loading="lazy" />}
          <p className="eyebrow">{s.programme || "CLIENT STORY"}</p>
          <h3>{s.title}</h3>
          <p>{s.summary}</p>
          <span className="text-link">
            Read the story <ArrowUpRight size={17} />
          </span>
        </Link>
      ))}
    </div>
  );
}
function Transformations() {
  const { data } = useSite();
  const { id } = useParams();
  if (id) {
    const s = data.stories.find((x: Entry) => x.id === id);
    if (!s) return <NotFound />;
    return (
      <>
        <PageIntro
          label="A PERSONAL JOURNEY"
          title={s.title}
          text={s.summary}
        />
        <article className="prose article-body">
          {s.image && <img src={s.image} alt={s.title} />}
          <p className="preline">{s.body}</p>
          <p>Individual results vary. Shared with permission.</p>
        </article>
      </>
    );
  }
  return (
    <>
      <section className="transformations-scene">
        <div className="transformations-photo" role="img" aria-label="Surya Singh in a black dress at a fitness event"><img src="/images/surya/transformations-reference.png" alt="" /></div>
        <div className="transformations-atmosphere" aria-hidden="true" />
        <div className="transformations-copy">
          <p className="eyebrow">MEET SURYA SINGH</p>
          <h1>More than a number.<br />A stronger <span>everyday.</span></h1>
          <p className="transformations-intro">Progress can mean more strength, a steadier routine<br className="wide-break" /> or simply feeling ready to begin.</p>
          <div className="transformations-invitation">
            <div><h2>Your story starts<br />with your <span>next step.</span></h2>
              <p>We share client journeys only with their permission. In the meantime, let’s talk about what meaningful progress looks like for you.</p>
              <Button to="/book">Start your conversation</Button>
            </div>
            <aside aria-label="Our focus"><span>REAL PEOPLE</span><span>REAL PROGRESS</span><span>REAL LIFESTYLE</span></aside>
          </div>
          <p className="transformations-baseline">HEALTHIER <b>•</b> HAPPIER <b>•</b> STRONGER YOU</p>
        </div>
        <div className="transformations-motto" aria-hidden="true">DISCIPLINE<br />CREATES<br />FREEDOM<i /></div>
      </section>
      {(data.stories.length > 0 || data.testimonials.length > 0) && <section className="wrap section compact">
        {data.stories.length > 0 && <><SectionHeading eyebrow="PERSONAL JOURNEYS" heading="Progress, in their own words." /><StoryCards stories={data.stories} /></>}
        {data.testimonials.length > 0 && (
          <div className="testimonial-grid">
            {data.testimonials.map((t: Entry) => (
              <details key={t.id}>
                <summary>
                  <h3>“{t.title}”</h3>
                  <span>{t.name}</span>
                </summary>
                <p>{t.body}</p>
              </details>
            ))}
          </div>
        )}
      </section>}
    </>
  );
}
function ArticleCards({ articles }: any) {
  return (
    <div className="article-grid">
      {articles.map((a: Entry) => (
        <Link to={"/journal/" + a.id} className="article-card" key={a.id}>
          {a.image ? (
            <img src={a.image} loading="lazy" alt={a.title} />
          ) : (
            <div className="article-illustration">
              <Leaf strokeWidth={1} />
            </div>
          )}
          <p className="eyebrow">
            {a.category} {a.readTime && " · " + a.readTime}
          </p>
          <h3>{a.title}</h3>
          <p>{a.excerpt}</p>
          <span className="text-link">
            Read story <ArrowUpRight size={17} />
          </span>
        </Link>
      ))}
    </div>
  );
}
function Journal() {
  const { data } = useSite();
  const { id } = useParams(),
    [lang, setLang] = useState("en");
  if (id) {
    const a = data.articles.find((x: Entry) => x.id === id);
    if (!a) return <NotFound />;
    return (
      <>
        <PageIntro
          label={a.category}
          title={lang === "hi" ? a.titleHi || a.title : a.title}
          text={a.excerpt}
        />
        <article className="prose article-body">
          {a.bodyHi && (
            <div className="filter-row">
              <button
                onClick={() => setLang("en")}
                className={lang === "en" ? "active" : ""}
              >
                English
              </button>
              <button
                onClick={() => setLang("hi")}
                className={lang === "hi" ? "active" : ""}
              >
                हिन्दी
              </button>
            </div>
          )}
          <p className="muted">
            {a.author}{" "}
            {a.publishedAt &&
              " · " + new Date(a.publishedAt).toLocaleDateString("en-IN")}
          </p>
          {a.image && <img src={a.image} alt={a.title} />}
          <div className="preline">{lang === "hi" ? a.bodyHi : a.body}</div>
          <button
            className="text-link"
            onClick={() =>
              navigator.share
                ? navigator
                    .share({ title: a.title, url: location.href })
                    .catch(() => {})
                : navigator.clipboard.writeText(location.href)
            }
          >
            Share article <ArrowUpRight size={16} />
          </button>
        </article>
        <StartBanner />
      </>
    );
  }
  return (
    <>
      <PageIntro
        label="THE FITNESS JOURNAL"
        title={
          <>
            A little knowledge.
            <br />A stronger everyday.
          </>
        }
        text="Thoughtful ideas about movement, habits and finding your own rhythm."
      />
      <section className="wrap section compact">
        {data.articles.length ? (
          <ArticleCards articles={data.articles} />
        ) : (
          <div className="empty-editorial">
            <Leaf size={48} strokeWidth={1} />
            <h2>Good things take thought.</h2>
            <p>
              Our first articles are being prepared. Join the list to hear when
              they’re ready.
            </p>
            <Newsletter />
          </div>
        )}
      </section>
    </>
  );
}
function Policy() {
  const { slug } = useParams();
  const { data } = useSite();
  const p = data.settings.policyOverrides?.[slug || ""] || policies[slug || ""];
  if (!p) return <NotFound />;
  return (
    <>
      <PageIntro
        label="CLEAR INFORMATION. CONSIDERED COACHING."
        title={p.title}
        text={p.intro}
      />
      <article className="prose article-body">
        <p className="muted">Updated {p.updated || "29 September 2026"}</p>
        {p.sections.map(([h, b]) => (
          <section key={h}>
            <h2>{h}</h2>
            <p>{b}</p>
          </section>
        ))}
        <Link to="/contact" className="text-link">
          Contact Surya <ArrowUpRight size={16} />
        </Link>
      </article>
    </>
  );
}
function Auth() {
  const loc = useLocation(),
    navigate = useNavigate();
  const { setUser } = useSite();
  const a = useAction();
  const setup = loc.pathname === "/setup",
    reset = loc.pathname === "/reset",
    forgot = loc.pathname === "/forgot-password";
  if (!setup && !reset && !forgot) return <LoginExperience />;
  return (
    <section className="auth-wrap wrap">
      <div className="auth-art">
        <span className="eyebrow">YOUR STRONGER CHAPTER</span>
        <h1>
          A little focus.
          <br />
          <em>A lot of possibility.</em>
        </h1>
        <Sun size={130} strokeWidth={0.6} />
      </div>
      <div className="auth-card">
        <Logo />
        <h2>
          {setup
            ? "Welcome, coach."
            : reset
              ? "A fresh start."
              : forgot
                ? "Let’s get you back in."
                : "Welcome back."}
        </h2>
        <p>
          {setup
            ? "Set up your private admin account using your local setup key."
            : reset
              ? "Choose a strong password for your account."
              : forgot
                ? "We’ll send a secure reset link if an account exists."
                : "Your plans, progress and next steps are waiting."}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const b = Object.fromEntries(new FormData(e.currentTarget));
            if (reset)
              b.token = new URLSearchParams(loc.search).get("token") || "";
            a.run(() =>
              post(
                "/auth/" +
                  (setup
                    ? "setup"
                    : reset
                      ? "reset"
                      : forgot
                        ? "forgot"
                        : "login"),
                b,
              ),
            ).then((r) => {
              if (r?.user) {
                setUser(r.user);
                navigate(r.user.role === "client" ? "/dashboard" : "/admin");
              } else if (r && reset) navigate("/login");
            });
          }}
        >
          {setup && (
            <>
              <Field label="Your name">
                <input name="name" defaultValue="Surya Singh" required />
              </Field>
              <Field
                label="Local setup key"
                hint="Found in the protected data/bootstrap-token.txt file on the server."
              >
                <input
                  name="token"
                  defaultValue={
                    new URLSearchParams(loc.search).get("token") || ""
                  }
                  required
                  type="password"
                  autoComplete="off"
                />
              </Field>
            </>
          )}
          {!reset && (
            <Field label="Email address">
              <input
                type="email"
                name="email"
                defaultValue={setup ? "surya737singh@gmail.com" : ""}
                required
                autoComplete="email"
              />
            </Field>
          )}
          {!forgot && (
            <Field
              label={
                reset || setup ? "Choose password (12+ characters)" : "Password"
              }
            >
              <input
                type="password"
                name="password"
                minLength={reset || setup ? 12 : 1}
                required
                autoComplete={
                  reset || setup ? "new-password" : "current-password"
                }
              />
            </Field>
          )}
          <Button disabled={a.busy}>
            {a.busy
              ? "Please wait…"
              : setup
                ? "Create admin account"
                : reset
                  ? "Save password"
                  : forgot
                    ? "Send reset link"
                    : "Sign in"}
          </Button>
          <Status action={a} />
        </form>
        {!setup && !reset && (
          <Link
            className="text-link"
            to={forgot ? "/login" : "/forgot-password"}
          >
            {forgot ? "Back to sign in" : "Forgot your password?"}
          </Link>
        )}
        <small>
          New client? <Link to="/consultation">Create your account and start your consultation.</Link>
        </small>
      </div>
    </section>
  );
}
function Unsubscribe() {
  const a = useAction(),
    loc = useLocation();
  return (
    <section className="page-intro wrap">
      <h1>Email preferences</h1>
      <p>
        You can stop receiving marketing emails. Necessary service messages are
        unaffected.
      </p>
      <Button
        onClick={() =>
          a.run(
            () => api("/unsubscribe" + loc.search),
            "You have been unsubscribed.",
          )
        }
        disabled={a.busy || !!a.success}
      >
        Unsubscribe from marketing
      </Button>
      <Status action={a} />
    </section>
  );
}
function NotFound() {
  return (
    <PageIntro
      label="LET’S GET YOU BACK ON TRACK"
      title="This page isn’t here."
    >
      <Button to="/">Back to home</Button>
    </PageIntro>
  );
}
function Effects() {
  const loc = useLocation();
  const { data } = useSite();
  useEffect(() => {
    window.scrollTo(0, 0);
    const programme = data.programmes.find(
      (p: Entry) => loc.pathname === "/programmes/" + p.id,
    );
    document.title = programme
      ? title(programme.title)
      : loc.pathname === "/"
        ? data.settings.seoTitle
        : loc.pathname
            .split("/")
            .filter(Boolean)
            .map((s) => s.replace(/-/g, " "))
            .join(" · ") + " | Train with Surya";
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute(
      "content",
      programme?.summary || data.settings.seoDescription,
    );
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.append(canonical);
    }
    canonical.setAttribute("href", location.origin + loc.pathname);
    let script = document.getElementById("structured-data");
    if (!script) {
      script = document.createElement("script");
      script.id = "structured-data";
      script.setAttribute("type", "application/ld+json");
      document.head.append(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Surya Singh",
      jobTitle: "Personal Trainer & Fitness Coach",
      url: location.origin,
      sameAs: [data.settings.instagram, data.settings.facebook],
    });
    if (
      localStorage.getItem("surya-analytics") === "yes" &&
      !/^\/(admin|dashboard|setup|reset)/.test(loc.pathname)
    ) {
      let s = sessionStorage.getItem("surya-visitor");
      if (!s) {
        s = crypto.randomUUID();
        sessionStorage.setItem("surya-visitor", s);
      }
      post("/analytics", {
        event: "page_view",
        path: loc.pathname,
        session: s,
        referrer: document.referrer
          ? new URL(document.referrer).hostname
          : "direct",
        device: innerWidth < 768 ? "mobile" : "desktop",
      }).catch(() => {});
    }
    const observer = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.07 },
    );
    document.querySelectorAll(".reveal").forEach((e) => observer.observe(e));
    const mut = new MutationObserver(() =>
      document
        .querySelectorAll(".reveal:not(.visible)")
        .forEach((e) => observer.observe(e)),
    );
    mut.observe(document.getElementById("root")!, {
      childList: true,
      subtree: true,
    });
    return () => {
      observer.disconnect();
      mut.disconnect();
    };
  }, [loc.pathname, data]);
  return null;
}
function CookieNotice() {
  const { cookieOpen, setCookieOpen } = useSite();
  if (!cookieOpen) return null;
  return (
    <div
      className="cookie-notice"
      role="region"
      aria-label="Cookie preferences"
    >
      <div>
        <strong>A little choice, a little privacy.</strong>
        <p>
          Essential cookies support sign-in. Optional analytics help improve
          public pages. <Link to="/policies/cookies">Details</Link>
        </p>
      </div>
      <div>
        <button
          className="button outline small"
          onClick={() => {
            localStorage.setItem("surya-analytics", "no");
            setCookieOpen(false);
          }}
        >
          Essential only
        </button>
        <button
          className="button small"
          onClick={() => {
            localStorage.setItem("surya-analytics", "yes");
            setCookieOpen(false);
          }}
        >
          Allow analytics
        </button>
      </div>
    </div>
  );
}
function App() {
  const [data, setData] = useState<any>(null),
    [error, setError] = useState(""),
    [user, setUser] = useState<any>(null),
    [cookieOpen, setCookieOpen] = useState(
      !localStorage.getItem("surya-analytics"),
    );
  const refresh = async () => {
    const [d, u] = await Promise.all([api("/public"), api("/auth/me")]);
    setData(d);
    setUser(u.user);
  };
  useEffect(() => {
    refresh().catch((e) => setError(e.message));
  }, []);
  if (error)
    return (
      <div className="loading">
        <h2>We couldn’t connect.</h2>
        <p>{error}</p>
        <button onClick={() => location.reload()}>Try again</button>
      </div>
    );
  if (!data)
    return (
      <div className="loading">
        <Sun className="spin" />
        <p>Finding your stronger chapter…</p>
      </div>
    );
  return (
    <SiteContext.Provider
      value={{ data, refresh, user, setUser, cookieOpen, setCookieOpen }}
    >
      <BrowserRouter>
        <Effects />
        <div className="app">
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <Header />
          <main id="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/meet-surya" element={<Meet />} />
              <Route path="/programmes" element={<Programmes />} />
              <Route path="/programmes/:id" element={<ProgrammeDetail />} />
              <Route path="/finder" element={<Finder />} />
              <Route path="/book" element={<Book />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/contact" element={<Book contact />} />
              <Route path="/transformations" element={<Transformations />} />
              <Route
                path="/transformations/:id"
                element={<Transformations />}
              />
              <Route path="/journal" element={<Journal />} />
              <Route path="/journal/:id" element={<Journal />} />
              <Route path="/policies/:slug" element={<Policy />} />
              {["login", "setup", "forgot-password", "reset"].map((p) => (
                <Route path={"/" + p} key={p} element={<Auth />} />
              ))}
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/dashboard" element={<ClientDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          {data.settings.whatsapp && (
            <a
              className="whatsapp-float"
              href={
                "https://wa.me/" +
                data.settings.whatsapp +
                "?text=" +
                encodeURIComponent(
                  "Hi Surya, I came through your website and would like to know more about your coaching programmes.",
                )
              }
              target="_blank"
              rel="noreferrer"
              aria-label="Chat with Surya on WhatsApp"
            >
              <MessageCircle size={22} />
              <span>Let’s talk</span>
            </a>
          )}
          <CookieNotice />
        </div>
      </BrowserRouter>
    </SiteContext.Provider>
  );
}
const rootElement = document.getElementById("root")! as HTMLElement & {
  __suryaRoot?: ReturnType<typeof createRoot>;
};
const appRoot =
  rootElement.__suryaRoot ||
  (rootElement.__suryaRoot = createRoot(rootElement));
appRoot.render(<App />);
