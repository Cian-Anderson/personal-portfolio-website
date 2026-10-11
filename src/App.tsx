// Portfolio shell.

import World from "./world/World";
import HUD from "./components/HUD";

export default function App() {
  return (
    <main className="app">
      <div className="world">
        <World />
      </div>

      <HUD />
    </main>
  );
}