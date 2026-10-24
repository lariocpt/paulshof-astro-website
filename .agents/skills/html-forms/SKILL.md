---
name: html-forms
description: Create or review HTML and React forms with named fields, labels, suitable input types, autofill, accessible validation, and visible submit controls. Use when editing form fields or submission behavior.
license: MIT
---

# HTML forms

Keep browser form semantics while handling application submissions without an
unintended full-page reload. Inspect the framework and existing form primitives
before choosing an implementation.

## Fields

- Use a real `form`. Give submitted controls meaningful `name` values and
  unique IDs where needed to associate labels, hints, and errors.
- Associate a visible label with each user-facing control. A placeholder is
  not a label. Group related radios or checkboxes with `fieldset` and `legend`.
- Choose types by meaning: `email`, `tel`, `url`, `password`, dates as needed.
  Use `number` for quantities, not account numbers, postal codes, or identifiers
  that may contain leading zeros. `inputMode` hints at a keyboard; it does not
  validate a value or replace a semantic input type.
- Set applicable `autocomplete` tokens (`autoComplete` in JSX): `name`,
  `email`, `tel`, `current-password`, `new-password`, or `one-time-code`, for
  example. Use section prefixes for repeated address groups when appropriate.
  Do not invent tokens or disable autofill and paste across a whole form.
- Prefer native `required`, length, range, and pattern constraints where useful.
  Also validate on the server; client validation is a usability feature.
- Remember that disabled controls and unchecked checkboxes are omitted from
  submitted form data. Model intentional omission and false values explicitly.

## Submission

- Provide a visible `button type="submit"` with a meaningful label. Give
  other buttons `type="button"`. Preserve Enter submission and native validation.
- Handle submission at the form, never solely through a button's `onClick`.
- In React versions supporting form Actions, use the existing Action pattern
  when appropriate. Function Actions receive `FormData` and do not need an
  event handler calling `preventDefault()`.
- Otherwise use `onSubmit` and call `event.preventDefault()` synchronously
  before awaiting work. Read `event.currentTarget` or capture `FormData`
  before awaiting. Never cancel submission without actually handling it.
- Preserve deliberate GET navigation, such as a search form, and native HTML
  or progressive-enhancement fallbacks. Do not add JavaScript just to prevent
  every possible navigation.
- Show pending state and guard accidental duplicate application submissions.
  Handle errors, restore retry ability, and retain useful entered values.

```tsx
// React Action API; saveEmail is an existing application-supplied function.
function EmailForm({ saveEmail, pending }: {
  saveEmail: (data: FormData) => void | Promise<void>;
  pending: boolean;
}) {
  return (
    <form action={saveEmail}>
      <label htmlFor="contact-email">Email</label>
      <input id="contact-email" name="email" type="email"
        autoComplete="email" required />
      <button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
```

## Feedback and verification

- Associate hints/errors through stable IDs and `aria-describedby`; mark
  invalid controls with `aria-invalid` when validation identifies an error.
- Announce asynchronous results through an appropriate status region. Keep
  ordinary field errors associated with their controls; avoid competing alerts
  on every field. Manage focus to an error summary or first invalid field when useful.
- Verify click and Enter submission, invalid input, pending/error/retry states,
  autofill, submitted field names, and no unintended document navigation.

## Sources

- [HTML form controls and autofill](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html)
- [WAI forms tutorial](https://www.w3.org/WAI/tutorials/forms/)
- [React form Actions and submission events](https://react.dev/reference/react-dom/components/form)
