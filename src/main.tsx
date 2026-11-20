import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { PAGE_HEAD, pageFromPath } from './data/pages';
import './styles/index.css';

const root = document.getElementById('root')!;
const page = pageFromPath(location.pathname);
const tree = <App page={page} />;

/* the build prerenders every page, so #root arrives full and is hydrated; under `npm run dev` it is empty and mounted */
if (root.firstElementChild) {
  hydrateRoot(root, tree);
} else {
  document.body.className = PAGE_HEAD[page].bodyClass;
  createRoot(root).render(tree);
}
