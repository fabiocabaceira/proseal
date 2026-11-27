import type { JSX } from 'react';
import type { Fact, Feature } from '../../data/projects';
import Icon from './Icon';

/* a project's fact sheet: four ruled cells (type, location, status, our work), each with its icon */
export function FactSheet({ facts, name }: { readonly facts: readonly Fact[]; readonly name: string }): JSX.Element {
  return (
    <dl className="pj-sheet" aria-label={`${name}: key facts`}>
      {facts.map((f) => (
        <div key={f.label}>
          <span className="pj-ico"><Icon name={f.icon} /></span>
          <dt>{f.label}</dt>
          <dd>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* the key features, as chips with their icons */
export function FeatureChips({ features, name }: { readonly features: readonly Feature[]; readonly name: string }): JSX.Element {
  return (
    <ul className="pj-chips" aria-label={`${name}: key features`}>
      {features.map((f) => (
        <li key={f.text}>
          <Icon name={f.icon} />
          {f.text}
        </li>
      ))}
    </ul>
  );
}
