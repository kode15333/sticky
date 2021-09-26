import App from './App';
import DOMRenderer from './DOMRenderer';

window.addEventListener('DOMContentLoaded', () => {
    new DOMRenderer(document, new App());
});
