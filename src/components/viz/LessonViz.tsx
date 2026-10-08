import type { VizType } from "../../data/types";
import { BinarySearchViz } from "./BinarySearchViz";
import { ConstantViz } from "./ConstantViz";
import { GridVisualizer, LoopBuildup } from "./GridVisualizer";
import { LinearScanViz } from "./LinearScanViz";
import { CallStackViz, MemoryArrayViz, MemoryConstantViz } from "./MemoryVisualizer";
import { MergeLevelsViz } from "./MergeLevelsViz";
import { PermutationsViz } from "./PermutationsViz";
import { RecursionTree } from "./RecursionTree";
import type { VizProps } from "./types";

/** Maps a lesson's `viz` type to its visualization component. */
export function LessonViz({ viz, ...props }: VizProps & { viz: VizType }) {
  switch (viz) {
    case "array-access":
      return <ConstantViz {...props} />;
    case "array-scan":
      return <LinearScanViz {...props} />;
    case "binary-search":
      return <BinarySearchViz {...props} />;
    case "grid":
      return (
        <div className="space-y-5">
          <LoopBuildup n={props.n} />
          <GridVisualizer {...props} mode="time" />
        </div>
      );
    case "merge-levels":
      return <MergeLevelsViz {...props} />;
    case "recursion-tree":
      return <RecursionTree {...props} />;
    case "permutations":
      return <PermutationsViz {...props} />;
    case "memory-constant":
      return <MemoryConstantViz {...props} />;
    case "memory-array":
      return <MemoryArrayViz {...props} />;
    case "call-stack":
      return <CallStackViz {...props} />;
    case "memory-grid":
      return <GridVisualizer {...props} mode="memory" />;
  }
}
