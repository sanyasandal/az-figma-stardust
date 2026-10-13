import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // first section = brand, last section = social + legal code, the rest are link columns
  const sections = [...footer.children];
  sections.forEach((section, i) => {
    if (i === 0) section.classList.add('footer-brand');
    else if (i === sections.length - 1 && sections.length > 2) section.classList.add('footer-bottom');
    else section.classList.add('footer-links');
  });

  footer.querySelectorAll('a').forEach((link) => {
    const icon = link.querySelector('.icon');
    if (!icon || link.textContent.trim()) return;
    const name = [...icon.classList].find((c) => c.startsWith('icon-'))?.substring(5) || '';
    const label = { x: 'X', youtube: 'YouTube', linkedin: 'LinkedIn' }[name]
      || name.charAt(0).toUpperCase() + name.slice(1);
    link.setAttribute('aria-label', label);
    link.classList.add('footer-social-link');
  });

  block.append(footer);
}
