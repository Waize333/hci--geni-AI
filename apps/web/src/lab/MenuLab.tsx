import { useEffect, useMemo, useRef, useState } from "react";
import { MENU_IDS, type ColourMapping, type MenuId, type TaxonomyNode } from "@meridian/taxonomy";
import type { StateLabel } from "@meridian/scoring";
import { useDialogFocus } from "../components/useDialogFocus";
import { MENU_NAMES, ProductDetail } from "../components/MenuChrome";
import { MenuA } from "../menus/MenuA";
import { MenuB } from "../menus/MenuB";
import { MenuC } from "../menus/MenuC";
import { MenuD } from "../menus/MenuD";
import { MenuE } from "../menus/MenuE";
import { MenuF } from "../menus/MenuF";
import "./menu-lab.css";

const MENUS = { A: MenuA, B: MenuB, C: MenuC, D: MenuD, E: MenuE, F: MenuF };
const MENU_HELP: Record<MenuId, string> = {
  A: "Open a department in the top bar, choose a collection, then select a watch.",
  B: "Choose a department and collection in the sidebar, then select a watch in the main panel.",
  C: "Open a department to see its three collections together, then select any watch directly.",
  D: "Choose a department tile, then a collection tile, then a watch. The tiles reorganise at each level.",
  E: "Choose a department card, a collection card, and a watch card. Use the Back card to move up a level.",
  F: "Choose a department around the hub, then a collection and a watch. Use the central Back control to move inward."
};
const STAGE_WIDTH = 1800;
const STAGE_HEIGHT = 720;

/** Fit the lab canvas without shrinking targets on a 1920 x 1080 screen. */
function useLabStageScale() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      setScale(Math.min(1, viewport.clientWidth / STAGE_WIDTH, viewport.clientHeight / STAGE_HEIGHT));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return { viewportRef, scale };
}
const MAPPINGS: Array<{ id: string; label: string; value: ColourMapping }> = [
  { id: "default", label: "Default mapping", value: { sport: "teal", dress: "amber", everyday: "olive", smart: "indigo" } },
  { id: "shift", label: "Shifted mapping", value: { sport: "indigo", dress: "teal", everyday: "amber", smart: "olive" } },
  { id: "reverse", label: "Reverse mapping", value: { sport: "olive", dress: "indigo", everyday: "teal", smart: "amber" } }
];

export function MenuLab() {
  const [menuId, setMenuId] = useState<MenuId>(() => {
    const requested = new URLSearchParams(window.location.search).get("menu");
    return MENU_IDS.find((id) => id === requested) ?? "A";
  });
  const [stateLabel, setStateLabel] = useState<StateLabel>("mixed");
  const [mappingId, setMappingId] = useState("default");
  const [leaf, setLeaf] = useState<TaxonomyNode | null>(null);
  const [events, setEvents] = useState<string[]>([]);
  const [previewVersion, setPreviewVersion] = useState(0);
  const mapping = useMemo(() => MAPPINGS.find((item) => item.id === mappingId)?.value ?? MAPPINGS[0]!.value, [mappingId]);
  const Menu = MENUS[menuId];
  const { viewportRef, scale } = useLabStageScale();
  const dialogRef = useDialogFocus(Boolean(leaf), () => setLeaf(null));
  useEffect(() => {
    if (!leaf) return;
    const onBack = () => setLeaf(null);
    window.addEventListener("popstate", onBack);
    return () => window.removeEventListener("popstate", onBack);
  }, [leaf]);

  return (
    <div className="lab-shell">
      <header className="lab-header">
        <div>
          <div className="eyebrow">Researcher tools</div>
          <h1>Menu lab</h1>
          <p className="small-note">Click through every layout without creating a session. Nothing is logged to the study database.</p>
        </div>
        <div className="lab-controls">
          <label className="field compact">
            <span>Menu</span>
            <select value={menuId} onChange={(event) => { setMenuId(event.target.value as MenuId); setLeaf(null); }}>
              {MENU_IDS.map((id) => (
                <option key={id} value={id}>
                  {id} · {MENU_NAMES[id]}
                </option>
              ))}
            </select>
          </label>
          <label className="field compact">
            <span>State context</span>
            <select value={stateLabel} onChange={(event) => setStateLabel(event.target.value as StateLabel)}>
              {(["happy", "frustrated", "confused", "bored", "mixed"] as const).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label className="field compact">
            <span>Colour mapping</span>
            <select value={mappingId} onChange={(event) => setMappingId(event.target.value)}>
              {MAPPINGS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <a className="button secondary" href="/admin">
            Researcher console
          </a>
          <a className="button quiet" href="/">
            Home
          </a>
        </div>
      </header>
      <section className="lab-guide" aria-label="Menu guide">
        <div className="lab-guide-current">
          <div>
            <strong>{menuId} · {MENU_NAMES[menuId]}</strong>
            <p>{MENU_HELP[menuId]}</p>
          </div>
          <button type="button" className="button secondary" onClick={() => {
            setLeaf(null);
            setEvents([]);
            setPreviewVersion((current) => current + 1);
          }}>
            Restart preview
          </button>
        </div>
        <details>
          <summary>Compare all six layouts & interaction tips</summary>
          <p className="lab-guide-tip">Click or use Tab to focus a choice, then Enter to select it. Escape closes product details. Restart preview returns the current layout to its first level and clears the local event history.</p>
          <div className="lab-guide-grid">
            {MENU_IDS.map((id) => (
              <div key={id}>
                <strong>{id} · {MENU_NAMES[id]}</strong>
                <p>{MENU_HELP[id]}</p>
              </div>
            ))}
          </div>
          <p className="lab-guide-tip">State context is a preview label; it does not automatically switch layouts. Colour mapping changes the department colours. These controls do not create a study session.</p>
        </details>
      </section>
      <div className="stage-viewport lab-stage-viewport" ref={viewportRef}>
        <div className="stage lab-stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          <div className="lab-canvas">
            <div className="lab-badge">
              Menu {menuId} · {MENU_NAMES[menuId]} · {stateLabel}
            </div>
            <Menu
              key={`${menuId}-${previewVersion}`}
              menuId={menuId}
              disabled={Boolean(leaf)}
              colourMapping={mapping}
              onLeafSelect={(node) => {
                setLeaf(node);
                setEvents((current) => [`leaf_select ${node.label}`, ...current].slice(0, 8));
              }}
              onEvent={(type, payload) => {
                setEvents((current) =>
                  [`${type} ${String(payload?.element_label ?? payload?.element_id ?? "")}`.trim(), ...current].slice(0, 8)
                );
              }}
            />
            {leaf ? (
              <div ref={dialogRef} tabIndex={-1} className="product-overlay" role="dialog" aria-modal="true" aria-label="Product detail">
                <ProductDetail
                  productId={leaf.productId ?? leaf.id}
                  onBack={() => setLeaf(null)}
                  onNext={undefined}
                  nextLabel=""
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <aside className="lab-event-strip" aria-label="Lab events">
        <span>Local event preview</span>
        {events.length ? events.map((item, index) => <code key={`${item}-${index}`}>{item}</code>) : <em>Click a node to preview events.</em>}
      </aside>
    </div>
  );
}
