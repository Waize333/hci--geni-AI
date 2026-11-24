import { useEffect, useState } from "react";
import { Clock3, FlaskConical, Layers3, MousePointer2, ShieldCheck, SlidersHorizontal, Sparkles } from "lucide-react";
import { MENU_IDS, type MenuId } from "@meridian/taxonomy";
import { MENU_NAMES } from "./components/MenuChrome";
import "./home.css";

function lastSessionId(): string | null {
  try {
    const raw = localStorage.getItem("meridian.runner.v2");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { sessionId?: unknown; phase?: string } };
    const state = parsed.state;
    return typeof state?.sessionId === "string" && state.sessionId && !["complete", "aborted"].includes(state.phase ?? "")
      ? state.sessionId : null;
  } catch {
    return null;
  }
}

export function Home() {
  const [resume, setResume] = useState<string | null>(null);
  const [menu, setMenu] = useState<MenuId>("D");
  useEffect(() => setResume(lastSessionId()), []);
  return (
    <div className="discovery-home">
      <a className="discovery-skip" href="#main-content">Skip to content</a>
      <header className="discovery-nav discovery-container">
        <a className="discovery-brand" href="/" aria-label="Meridian home"><span aria-hidden="true">m.</span><div>MERIDIAN<small>Human–computer interaction lab</small></div></a>
        <nav aria-label="Primary"><a href="#experience">The experience</a><a href="#how-it-works">How it works</a><a className="discovery-console" href="/admin"><SlidersHorizontal size={16} aria-hidden="true" /> Researcher console</a></nav>
      </header>

      <main id="main-content" className="discovery-container" tabIndex={-1}>
        <section className="discovery-hero" aria-labelledby="discovery-title">
          <div className="discovery-copy">
            <div className="discovery-kicker"><span /> A study in finding your way</div>
            <h1 id="discovery-title">Same destination.<br />Six different<br /><em>ways to get there.</em></h1>
            <p>Does the way you feel change the way you navigate? Explore six menu designs in one watch store, and discover the human side of interface design.</p>
            <div className="discovery-actions"><a className="discovery-button" href="/lab"><MousePointer2 size={18} aria-hidden="true" /> Explore the menu lab</a><a className="discovery-text-link" href="#how-it-works">About the study</a></div>
            <div className="discovery-hero-notes"><span><Clock3 size={16} aria-hidden="true" /> About 15 minutes</span><span><ShieldCheck size={16} aria-hidden="true" /> Eye tracking is optional</span></div>
            {resume && <a className="discovery-resume" href={`/run/${encodeURIComponent(resume)}`}>Continue your saved session</a>}
          </div>

          <div className="discovery-showcase">
            <div className="discovery-preview-bar"><span className="discovery-preview-brand">MERIDIAN <small>TIMEPIECES</small></span><span>MENU EXPLORER</span></div>
            <div className="discovery-preview-copy"><span className="discovery-label">ONE STORE. A DIFFERENT PERSPECTIVE.</span><h2>Find your next favourite.</h2><p>72 timepieces. Six ways to explore.</p></div>
            <div className="discovery-preview-image"><img src={`/assets/menus/menu-${menu.toLowerCase()}.jpg`} alt={`Preview of the ${MENU_NAMES[menu]} navigation design`} width="1920" height="1080" /></div>
            <div className="discovery-preview-footer"><span><Layers3 size={17} aria-hidden="true" /> {MENU_NAMES[menu]}</span><a href={`/lab?menu=${menu}`}>Try this design</a></div>
            <div className="discovery-switcher" role="group" aria-label="Preview a menu design">{MENU_IDS.map((id) => <button key={id} type="button" aria-label={`Preview ${MENU_NAMES[id]}`} aria-pressed={menu === id} onClick={() => setMenu(id)}>{id}</button>)}<span>Choose your perspective</span></div>
          </div>
        </section>

        <dl className="discovery-stats"><div><dt>06</dt><dd>Navigation designs</dd></div><div><dt>04</dt><dd>Emotion scenarios</dd></div><div><dt>72</dt><dd>Watch products</dd></div><div><dt>12</dt><dd>Scored searches</dd></div></dl>

        <section id="experience" className="discovery-experience" aria-labelledby="experience-title">
          <div className="discovery-section-heading"><div><div className="discovery-label">EXPLORE. COMPARE. UNDERSTAND.</div><h2 id="experience-title">A small store. A bigger question.</h2></div><p>One product catalogue keeps the destination consistent.<br />The journey is where things get interesting.</p></div>
          <div className="discovery-cards">
            <article><div className="discovery-card-icon"><Layers3 aria-hidden="true" /></div><h3>Six ways to navigate</h3><p>From familiar bars and sidebars to fractal tiles and a radial lattice. Try every design with the same catalogue.</p><a href="/lab">Explore the designs</a></article>
            <article><div className="discovery-card-icon violet"><Sparkles aria-hidden="true" /></div><h3>Four states of mind</h3><p>Short emotion scenarios and check-ins help researchers examine how feelings relate to finding a product.</p><a href="#how-it-works">See the study flow</a></article>
            <article><div className="discovery-card-icon blue"><FlaskConical aria-hidden="true" /></div><h3>Research you can inspect</h3><p>Create session links, review progress, and export recorded searches through the protected researcher console.</p><a href="/admin">Open researcher console</a></article>
          </div>
        </section>

        <section id="how-it-works" className="discovery-method" aria-labelledby="method-title">
          <div><div className="discovery-label">WHAT TO EXPECT</div><h2 id="method-title">A clear path,<br />from start to finish.</h2><p>Participants join through a link supplied by their researcher. The menu lab is open to explore without starting a study session.</p><a className="discovery-button light" href="/lab">Try the lab first</a></div>
          <ol><li><strong>Get comfortable</strong><p>Review consent, choose whether to use eye tracking, and complete a few practice searches.</p></li><li><strong>Explore and find</strong><p>Move through four emotion blocks and twelve timed product searches, with check-ins along the way.</p></li><li><strong>Share your experience</strong><p>Rate usability and workload, then finish with a debrief. You can stop the session at any time.</p></li></ol>
        </section>

        <section className="discovery-faq" aria-labelledby="faq-title"><div className="discovery-label">A FEW THINGS TO KNOW</div><h2 id="faq-title">Before you begin</h2>
          <details><summary>Do I need to turn on my camera?</summary><p>No. Eye tracking requires separate consent. You can decline it, or continue without it if calibration fails. Raw video is never retained.</p></details>
          <details><summary>Can I try the menus without joining the study?</summary><p>Yes. Open the menu lab to try all six designs, change their colour mapping, and inspect navigation. The lab does not create a participant session.</p></details>
          <details><summary>How do I start a participant session?</summary><p>Use the study link provided by your researcher. Researchers can sign in to the researcher console to create and manage participant links.</p></details>
        </section>
        <aside className="discovery-notice"><ShieldCheck size={22} aria-hidden="true" /><p><strong>Research prototype</strong> This build is for demonstration and pilot preparation. Ethics approval and approved study content are required before collecting real participant data.</p></aside>
      </main>
      <footer className="discovery-footer discovery-container"><a className="discovery-brand" href="/"><span aria-hidden="true">m.</span><div>MERIDIAN<small>Exploring the human side of navigation.</small></div></a><span>HCI research project · Emotion-contingent navigation</span><a href="/admin">Researcher access</a></footer>
    </div>
  );
}
