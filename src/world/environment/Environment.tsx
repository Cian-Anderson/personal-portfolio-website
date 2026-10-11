// World environment.

import Cityscape from "../city/Cityscape";
import ProjectBillboards from "../projects/ProjectBillboards";

export default function Environment() {
  return (
    <group>
      <Cityscape />
      <ProjectBillboards />
    </group>
  );
}