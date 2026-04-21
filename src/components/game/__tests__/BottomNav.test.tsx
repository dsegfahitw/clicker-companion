import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  RouterProvider,
  createRouter,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  Outlet,
} from "@tanstack/react-router";
import { BottomNav } from "../BottomNav";

function buildRouter(initialPath: string) {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <Outlet />
        <BottomNav />
      </>
    ),
  });
  const make = (path: string) =>
    createRoute({ getParentRoute: () => rootRoute, path, component: () => <div>{path}</div> });
  const routes = [
    make("/"),
    make("/work"),
    make("/business"),
    make("/skills"),
    make("/market"),
    make("/settings"),
  ];
  rootRoute.addChildren(routes);
  return createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });
}

describe("<BottomNav />", () => {
  it("renders all 6 labelled tabs", async () => {
    const router = buildRouter("/");
    render(<RouterProvider router={router as any} />);
    for (const label of ["Життя", "Робота", "Бізнес", "Навички", "Магазин", "Опції"]) {
      expect(await screen.findByText(label)).toBeInTheDocument();
    }
  });
});
