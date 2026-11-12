import type { Node } from "@/lib/outlook";
import { BASIS_LABEL } from "@/lib/outlook";

/** Branch tree. Each node shows its conditional probability and the basis for
 *  it; the joint probability down a path is shown so a 42%-of-34% branch is not
 *  mistaken for a 42% outcome. */
export default function Tree({ nodes, depth = 0, parentProb = 1 }:
  { nodes: Node[]; depth?: number; parentProb?: number }) {
  return (
    <ul className={`tree d${depth}`}>
      {nodes.map((n) => {
        const joint = parentProb * n.prob;
        const b = BASIS_LABEL[n.basis];
        return (
          <li key={n.id} className="reveal">
            <div className={`tnode t-${n.tone}`}>
              <div className="thead">
                <span className="tglyph">
                  {n.tone === "up" ? "▲" : n.tone === "down" ? "▼" : "▬"}
                </span>
                <span className="tlabel">{n.label}</span>
                <span className="tprob num">{(n.prob * 100).toFixed(0)}%</span>
              </div>
              <div className="tbar">
                <i style={{ width: `${n.prob * 100}%` }} />
              </div>
              <div className="tmeta">
                <span className={`ev ${b.tone}`}>{b.t}</span>
                {n.n && <span className="meta">n={n.n}</span>}
                {n.level && <span className="meta">at {n.level.toLocaleString("en-IN")}</span>}
                {depth > 0 && (
                  <span className="meta" title="Probability of reaching this point from the start">
                    joint {(joint * 100).toFixed(1)}%
                  </span>
                )}
              </div>
              {n.detail && <p className="tdetail">{n.detail}</p>}
            </div>
            {n.children && <Tree nodes={n.children} depth={depth + 1} parentProb={joint} />}
          </li>
        );
      })}
    </ul>
  );
}
