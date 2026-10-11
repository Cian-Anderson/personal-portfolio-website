// City layout builder.

import MonolithTower from "../MonolithTower";
import { CITY_TOWERS } from "./cityTowers";

export default function Cityscape() {
  return (
    <group>
      {CITY_TOWERS.map((tower) => (
        <MonolithTower
          key={tower.id}
          position={tower.position}
          width={tower.width}
          depth={tower.depth}
          height={tower.height}
          accent={tower.accent}
        />
      ))}
    </group>
  );
}