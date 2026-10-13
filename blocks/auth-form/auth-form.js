const FIELD_TYPES = ['email', 'password', 'text', 'tel', 'number', 'select', 'textarea'];
const ACTION_TYPES = ['submit', 'reset', 'button', 'link'];

let fieldCounter = 0;

function cellText(cell) {
  return cell ? cell.textContent.trim() : '';
}

/**
 * Splits an authored label like "Email *" into text and a required flag.
 */
function parseLabel(cell) {
  const raw = cellText(cell);
  const required = /\*\s*$/.test(raw);
  return { text: raw.replace(/\s*\*\s*$/, ''), required };
}

function buildLabel(forId, { text, required }) {
  const label = document.createElement('label');
  label.htmlFor = forId;
  label.className = 'auth-form-label';
  label.textContent = text;
  if (required) {
    const mark = document.createElement('span');
    mark.className = 'auth-form-required';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = ' *';
    label.append(mark);
  }
  return label;
}

function readOptions(cell) {
  if (!cell) return [];
  const items = [...cell.querySelectorAll('li')].map((li) => li.textContent.trim());
  if (items.length) return items.filter(Boolean);
  return cellText(cell).split(/\n|,/).map((s) => s.trim()).filter(Boolean);
}

function addPasswordToggle(wrapper, input) {
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'auth-form-reveal';
  toggle.setAttribute('aria-label', 'Show password');
  toggle.setAttribute('aria-pressed', 'false');
  toggle.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', String(show));
    toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });
  wrapper.append(toggle);
}

function buildField(type, cells) {
  fieldCounter += 1;
  const label = parseLabel(cells[0]);
  const slug = label.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'field';
  const id = `auth-${slug}-${fieldCounter}`;
  const field = document.createElement('div');
  field.className = `auth-form-field auth-form-field-${type}`;

  const top = document.createElement('div');
  top.className = 'auth-form-field-top';
  top.append(buildLabel(id, label));
  const helperLink = cells[3]?.querySelector('a');
  if (helperLink) {
    helperLink.className = 'auth-form-helper-link';
    top.append(helperLink);
  }
  field.append(top);

  let control;
  if (type === 'select') {
    control = document.createElement('select');
    const options = readOptions(cells[2]);
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = options.shift() || 'Select an option';
    control.append(placeholder);
    options.forEach((text) => {
      const option = document.createElement('option');
      option.textContent = text;
      control.append(option);
    });
  } else if (type === 'textarea') {
    control = document.createElement('textarea');
    control.placeholder = cellText(cells[2]);
  } else {
    control = document.createElement('input');
    control.type = type;
    control.placeholder = cellText(cells[2]);
    const autocomplete = { email: 'email', password: 'current-password', tel: 'tel' }[type];
    if (autocomplete) control.autocomplete = autocomplete;
  }
  control.id = id;
  control.name = slug;
  control.required = label.required;
  control.className = 'auth-form-control';

  const controlWrap = document.createElement('div');
  controlWrap.className = 'auth-form-control-wrap';
  controlWrap.append(control);
  if (type === 'password') addPasswordToggle(controlWrap, control);
  field.append(controlWrap);
  return field;
}

function buildChoice(type, cells) {
  fieldCounter += 1;
  const { required } = parseLabel(cells[0]);
  const id = `auth-${type}-${fieldCounter}`;
  const wrapper = document.createElement('div');
  wrapper.className = `auth-form-choice auth-form-${type}`;
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = id;
  input.name = id;
  input.required = required;
  if (type === 'toggle') input.setAttribute('role', 'switch');
  const label = document.createElement('label');
  label.htmlFor = id;
  if (cells[0]) label.append(...cells[0].childNodes);
  wrapper.append(input, label);
  return wrapper;
}

function buildAction(type, cells) {
  const style = cellText(cells[2]).toLowerCase();
  const link = cells[0]?.querySelector('a');
  if (link) {
    const isPrimary = style ? style === 'primary' : Boolean(link.closest('strong'));
    link.className = `button ${isPrimary ? 'primary' : 'secondary'}`;
    link.textContent = link.textContent.trim();
    return link;
  }
  const button = document.createElement('button');
  button.type = { reset: 'reset', button: 'button' }[type] || 'submit';
  if (button.type === 'button') button.dataset.unconnected = 'true';
  const isPrimary = style ? style === 'primary' : button.type === 'submit';
  button.className = `button ${isPrimary ? 'primary' : 'secondary'}`;
  button.textContent = cellText(cells[0]);
  return button;
}

function buildDivider(cells) {
  const divider = document.createElement('div');
  divider.className = 'auth-form-divider';
  divider.setAttribute('role', 'separator');
  const text = cellText(cells[0]);
  if (text) {
    const span = document.createElement('span');
    span.textContent = text;
    divider.append(span);
  }
  return divider;
}

function buildRich(className, cells) {
  const el = document.createElement('div');
  el.className = className;
  if (cells[0]) el.append(...cells[0].childNodes);
  // a leading "*" (e.g. "* Required before proceeding") gets the required colour
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let first = walker.nextNode();
  while (first && !first.textContent.trim()) first = walker.nextNode();
  if (first && /^\s*\*/.test(first.textContent)) {
    first.textContent = first.textContent.replace(/^\s*\*\s*/, '');
    const mark = document.createElement('span');
    mark.className = 'auth-form-required';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = '* ';
    first.before(mark);
  }
  return el;
}

function buildGroupLabel(cells) {
  const label = parseLabel(cells[0]);
  const el = document.createElement('p');
  el.className = 'auth-form-group-label';
  el.textContent = label.text;
  if (label.required) {
    const mark = document.createElement('span');
    mark.className = 'auth-form-required';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = ' *';
    el.append(mark);
  }
  return el;
}

function matchPasswords(form) {
  const passwords = [...form.querySelectorAll('.auth-form-field-password input')];
  if (passwords.length < 2) return;
  // the last two password fields are "new" and "confirm"; any earlier one is the current password
  const [first, confirm] = passwords.slice(-2);
  first.autocomplete = 'new-password';
  confirm.autocomplete = 'new-password';
  const check = () => confirm.setCustomValidity(
    confirm.value && confirm.value !== first.value ? 'Passwords do not match.' : '',
  );
  first.addEventListener('input', check);
  confirm.addEventListener('input', check);
}

/**
 * Auth form: one row per form element. Column 1 = label or content, column 2 = type keyword,
 * column 3 = placeholder, select options or button style, column 4 = optional link beside label.
 * Rows with an unknown or empty type (e.g. "content") render column 1 as rich text.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const form = document.createElement('form');
  form.noValidate = true;
  const fields = document.createElement('div');
  fields.className = 'auth-form-fields';
  let actions = null;
  let note = null;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;
    const type = cellText(cells[1]).toLowerCase();
    if (ACTION_TYPES.includes(type)) {
      if (!actions || actions !== fields.lastElementChild) {
        actions = document.createElement('div');
        actions.className = 'auth-form-actions';
        fields.append(actions);
      }
      actions.append(buildAction(type, cells));
      return;
    }
    if (type === 'note') {
      note = buildRich('auth-form-note', cells);
      return;
    }
    let el;
    if (FIELD_TYPES.includes(type)) el = buildField(type, cells);
    else if (type === 'checkbox' || type === 'toggle') el = buildChoice(type, cells);
    else if (type === 'divider') el = buildDivider(cells);
    else if (type === 'heading') el = buildGroupLabel(cells);
    else if (type === 'spacer') {
      el = document.createElement('div');
      el.className = 'auth-form-spacer';
      el.setAttribute('aria-hidden', 'true');
    } else el = buildRich('auth-form-text', cells);
    fields.append(el);
  });

  const status = document.createElement('p');
  status.className = 'auth-form-status';
  status.setAttribute('role', 'status');
  status.hidden = true;

  form.append(fields, status);
  matchPasswords(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      status.hidden = true;
      form.reportValidity();
      return;
    }
    status.textContent = 'This form is not connected to an account service yet, so nothing was sent.';
    status.hidden = false;
  });
  form.addEventListener('reset', () => {
    status.hidden = true;
  });
  form.querySelectorAll('button[data-unconnected]').forEach((button) => {
    button.addEventListener('click', () => {
      status.textContent = `${button.textContent} is not connected yet.`;
      status.hidden = false;
    });
  });

  block.replaceChildren(form);
  if (note) block.append(note);
}
