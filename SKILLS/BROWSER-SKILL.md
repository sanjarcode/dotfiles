BROWSER FORM INTERACTION POLICY

Use this policy for all browser-use tasks, viz Chrome/ego-lite. Optimize for deterministic, fast, maximally non-blocking form completion while preventing input from reaching the wrong control.

Priority order

1. Keyboard navigation
2. HTML focus/programmatic navigation
3. Mouse, only as a last resort

Important keyboard correction:
- Tab moves to the next field.
- Shift+Tab moves to the previous field.
- Alt+Tab switches applications and must not be used for form navigation.

Before editing

1. Read the form once.
2. Map every required field:
   - visible label
   - element type
   - stable id/name/ARIA label
   - whether it is free text, dropdown, searchable combobox, checkbox, radio group, date picker, or file upload
3. Identify optional and voluntary fields. Leave voluntary demographic fields unanswered unless explicitly instructed.
4. Record all known required answers before beginning.
5. Do not batch actions until the current field has been verified.

Multi-form delayed-input strategy

When the task contains multiple independent forms or tabs, remain maximally non-blocking.

1. Inspect all forms and maintain a queue containing:
   - tab or form name
   - unanswered question
   - available options or expected format
   - whether the answer is required for submission
2. If a form requires an unknown answer:
   - save all safely supported progress;
   - queue the unanswered question;
   - do not guess;
   - do not stop the overall task;
   - skip that form and continue to the next independent tab.
3. Complete and submit every form that can be finished without additional input.
4. Close each successfully submitted tab after verifying confirmation.
5. Do not interrupt the user for one question while other independent work remains.
6. Only after every currently doable form is complete, ask all queued questions together in one concise message.
7. Group questions by company, page, or form and include the exact choices where applicable.
8. After the user answers, resume each blocked form, apply the queued answers, submit, verify, and close it.
9. If a blocked form cannot safely preserve partial state, record its known answers locally in the working context and refill it after receiving the missing answers.
10. Authentication, CAPTCHA, OTP, or explicit user-control handoffs remain hard stops only for the affected tab. Continue other independent tabs whenever possible.

Keyboard-first workflow

- Use Tab for the next field.
- Use Shift+Tab for the previous field.
- Before typing, verify that the focused control is the intended field by checking its label, id, name, or activeElement.
- Use Page Down and Page Up for complete, mutually exclusive scrolling through the page.
- Do not use free-form typing when the control offers finite options.

Free-text field:

1. Verify focus.
2. Clear the existing value when necessary.
3. Type the answer.
4. Read the value back.
5. Press Tab only after verification.

Dropdown or select:

1. Verify focus.
2. Press Space to open it. Use Enter only when Space is unsupported.
3. Inspect or read the available options.
4. Use Arrow Up/Arrow Down to highlight the exact option.
5. Press Space or Enter to commit it.
6. Verify the rendered selected value.
7. Never assume typed search text is a committed selection.

Searchable combobox:

1. Use typing only when searching is necessary.
2. Verify aria-expanded is true and the intended options are visible.
3. Type the minimum unique search text.
4. Highlight the exact result with Arrow keys.
5. Commit it with Enter.
6. Verify that the input query disappeared and the selected-value element contains the expected answer.
7. Values such as “YesYes” indicate failure, not selection.

Checkbox or radio group:

1. Navigate to the exact labeled option.
2. Press Space.
3. Verify checked, selected, or aria-checked state.

Date picker:

1. Press Space to open it.
2. Navigate using Arrow keys and Page Up/Page Down where supported.
3. Select with Space or Enter.
4. Verify the final displayed date.

File upload:

1. Focus the exact file input associated with the requested field.
2. Upload only the intended file.
3. Verify the displayed filename before continuing.

Scrolling

- Use Page Down and Page Up.
- Avoid arbitrary incremental scrolling.
- Read every section once without repeatedly jumping around the page.

HTML/programmatic navigation fallback

Use only when keyboard focus order is broken or excessively long.

1. Resolve the exact form entity using stable label, id, name, role, or ARIA attributes.
2. Programmatically focus that entity.
3. Immediately verify document.activeElement matches the intended control.
4. After focus is verified, use keyboard input and keyboard selection.
5. Do not call click() merely to select a dropdown option.
6. Do not type if focus verification fails.

Mouse fallback

Use the mouse only after both keyboard navigation and programmatic focus fail.

1. Make one precise action on the exact labeled control.
2. Verify the resulting focus or selected state immediately.
3. Do not use repeated speculative clicks.
4. Return to keyboard navigation after the single fallback action.

State-safety rules

- Never type before confirming the focused field.
- Never continue after an unexpected value appears.
- Never treat visible combobox text as proof of selection.
- Never leave an unrelated dropdown open.
- Press Escape to close stale menus before moving to another field.
- If text lands in the wrong field, stop immediately and repair it before proceeding.
- Do not populate unrelated or voluntary fields during recovery.
- Verify phone country code and phone number independently.
- Do not append location text to a phone, email, or other previous field.
- An unknown answer blocks only its dependent form, not the entire batch.

Efficient execution

Use four passes:

1. Inspect: map all forms, fields, dependencies, and missing answers.
2. Fill: complete known fields sequentially, validating each before advancing.
3. Submit: finish every unblocked form, verify success, and close its tab.
4. Resolve: ask all queued questions once, then resume and submit blocked forms.

Avoid repeated full-page snapshots and one-action tool calls. Keep one compact form-state record and update it as fields are completed.

Stop conditions

Queue the question and skip only the affected form when:

- a required answer is unknown;
- a legal, visa, compensation, demographic, or employment-restriction answer cannot be verified.

Pause only the affected tab when:

- login, CAPTCHA, OTP, or user handoff is required;
- the browser reports that the user has taken control.

Continue other independent tabs whenever safe and possible.

After submission

- Confirm submission using an explicit success message or confirmation URL.
- Close the submitted application tab.
- Report the role as submitted, blocked, or unavailable with the exact reason.
- At the end of a multi-form batch, provide one consolidated status report.
