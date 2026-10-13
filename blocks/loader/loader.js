/**
 * Loader: a decorative pending indicator. An optional authored cell becomes the
 * accessible label, otherwise "Loading".
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const label = block.textContent.trim() || 'Loading';
  block.replaceChildren();
  block.setAttribute('role', 'status');
  block.setAttribute('aria-label', label);
  for (let i = 0; i < 2; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'loader-dot';
    dot.setAttribute('aria-hidden', 'true');
    block.append(dot);
  }
}
