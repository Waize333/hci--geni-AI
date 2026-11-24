import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { Home } from "../src/Home";
import { MENU_IDS } from "@meridian/taxonomy";
import { MENU_NAMES } from "../src/components/MenuChrome";

beforeEach(() => localStorage.clear());

describe("home entry points", () => {
  it("opens each preview in its matching menu lab without starting a participant session", () => {
    render(<Home />);
    for (const id of MENU_IDS) {
      fireEvent.click(screen.getByRole("button", { name: `Preview ${MENU_NAMES[id]}` }));
      expect(screen.getByRole("button", { name: `Preview ${MENU_NAMES[id]}` })).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByRole("link", { name: "Try this design" })).toHaveAttribute("href", `/lab?menu=${id}`);
      expect(screen.getByRole("img")).toHaveAttribute("src", `/assets/menus/menu-${id.toLowerCase()}.jpg`);
    }
    expect(screen.getByRole("link", { name: "Explore the menu lab" })).toHaveAttribute("href", "/lab");
  });

  it("resumes an active saved session with a safely encoded identifier", () => {
    localStorage.setItem("meridian.runner.v2", JSON.stringify({ state: { sessionId: "session/a?b", phase: "trial" } }));
    render(<Home />);
    expect(screen.getByRole("link", { name: "Continue your saved session" })).toHaveAttribute("href", "/run/session%2Fa%3Fb");
  });

  it.each(["complete", "aborted"])("does not offer to resume a %s session", (phase) => {
    localStorage.setItem("meridian.runner.v2", JSON.stringify({ state: { sessionId: "ended", phase } }));
    render(<Home />);
    expect(screen.queryByRole("link", { name: /Continue your saved/ })).not.toBeInTheDocument();
  });

  it.each(["invalid json", "null", '{"state":{"sessionId":42}}'])("loads despite malformed saved session: %s", (saved) => {
    localStorage.setItem("meridian.runner.v2", saved);
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Continue your saved/ })).not.toBeInTheDocument();
  });
});
