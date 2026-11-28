# Protea Web Example

This local page connects Button, Modal, Select, Sidebar, Switch and Tabs to native HTML.
Checking also supplies an independent checkbox. A simulated export projects an application-owned
measurement through native progress and text. The page's
[import map](index.html) maps the six family specifiers to their files under
`packages/components/dist/api/families/` and `@luscious-garden/protea-components/capabilities`
to the built capability aggregate. The Core root supplies the page scope.

## Run locally

Use the [repository toolchain](../../docs/en/tooling/index.md#selected-contributor-environment).
From the repository root, install dependencies and build the packages. Rebuild after changes
to Core or Components so the example loads the current exports from `dist/`.
Serve the repository root and open `/examples/web/` so the server can also serve the generated
files under `/packages/`.

```sh
pnpm install --frozen-lockfile
pnpm run build
```

For **Go Live** in VS Code, open the repository root as your workspace. Open
`examples/web/index.html` with Live Server and use the URL under `/examples/web/` so the server
can also reach `/packages/`. [Live Server settings](https://ritwickdey.github.io/vscode-live-server/docs/settings.html)

With Python 3, start the server from the repository root.

```sh
python -m http.server --bind 127.0.0.1 8000
```

Open [the example in your browser](http://127.0.0.1:8000/examples/web/).
Stop the server with Ctrl+C when finished.

## Try the dialogue

1. Use Tab to focus **Open dialogue**, then press Enter. The heading names the dialogue and
   **Close dialogue** receives initial focus.
2. Activate **Close dialogue** or press Escape. The dialogue closes and focus returns to
   **Open dialogue**.
3. Open it again and select **Refuse close requests**. Activate **Close dialogue**, then press
   Escape. The same policy refuses the button's request and a cancellable Escape request.
   The browser can enforce dismissal on a subsequent Escape without fresh user activation.
   The host observes the resulting `close` event and synchronises the application-owned
   opening state. If the dialogue is still open, clear **Refuse close requests** and activate
   **Close dialogue**. [Close watcher infrastructure](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-infrastructure)

Both dialogues use native focus restoration, which attempts to return focus to the element
that had it before opening. A pointer click may leave the opening button unfocused on macOS,
as reported in WebKit. [HTML closing steps](https://html.spec.whatwg.org/multipage/interactive-elements.html#close-the-dialog),
[WebKit pointer focus report](https://bugs.webkit.org/show_bug.cgi?id=229895).

## Try the draft editor

1. Use Tab to focus **Open editor**, then press Enter. Focus starts in **Draft**. Press Escape
   before editing to close the dialogue and return focus to **Open editor**.
2. Reopen the editor and change the draft. A cancellable Escape request leaves the editor open.
   If the browser completes dismissal, reopen the editor to find the unsaved draft intact.
3. **Save** keeps the current text. **Discard** restores the last saved text. Both actions
   request closure. The saved value and draft live in memory until the page reloads.

## Try supplementary navigation

1. Activate **Supplementary navigation** with the mouse or keyboard. The labelled navigation
   region appears in the normal page flow and the button reports `aria-expanded="true"`.
   With the button focused, press Tab to reach the navigation link.
2. Activate the button again. The region is hidden and the button reports
   `aria-expanded="false"`. Both attributes follow Sidebar's effective open state.

## Try the independent disclosure

1. Reload the page. **Details** reports `aria-expanded="false"` and its content is hidden.
2. Use Tab to focus Details, then Enter to open it. The content appears, the button reports
   `aria-expanded="true"` and keyboard focus stays on the control. Press Space to close it.
3. Use pointer clicks to open and close Details again. Its content and expanded state follow
   each effective opening change.

The [example composition](main.mjs) connects a Button to an internal
[Opening capability](../../docs/en/packages/components/capabilities/openable/index.md).
Enter, Space and pointer activation use the native button's click path through the existing
[Button binding](button.mjs). An accepted action requests open or close using the current
`isOpen` value. Button acceptance and the opening outcome remain separate. Setup projects the
initial state. The opening observer then updates visibility and `aria-expanded` together.
`aria-controls` identifies the associated text-only content.

## Try the shared help preference

1. Start with the help text hidden and **Toggle help** reporting `aria-expanded="false"`.
   Activate **Show help** with the pointer or focus it with Tab and press Space. The switch
   becomes checked, the help text appears and **Toggle help** reports `aria-expanded="true"`.
2. Activate **Toggle help**. The help text hides, **Toggle help** reports
   `aria-expanded="false"` and **Show help** becomes unchecked. Both controls reflect the
   same preference regardless of which one changes it.

The [checked-input binding](checked-input.mjs) forwards one native change and restores the effective
checked value if the request is refused. **Show help** retains its switch semantics. A page-owned
Checking capability supplies the value. The application's authority connects that value to Switch
and to the Button's activation action.

## Try theme selection

1. Open the page. **Theme preference** starts at **System** and the status shows
   **Effective theme: light** or **Effective theme: dark**. Change the operating system theme
   while the page stays open, or emulate `prefers-color-scheme` in the browser's developer
   tools when available. The whole status updates while the chooser stays at **System**.
2. Choose **Light** or **Dark** with the pointer, or focus the chooser with Tab and use the
   native keyboard controls. The effective theme follows that choice. Change the system theme
   again while the fixed preference is selected. The page keeps the chosen theme.
3. Activate **Use system theme**. This asks the Theme Manager directly to change the preference.
   The chooser reflects **System** and the page uses the latest system theme.
4. Choose **Light** or **Dark**, turn on **Refuse theme changes**, and try a different
   preference. The chooser returns to its current selection and the page keeps its effective
   theme. **Use system theme** follows the same policy.
5. Clear the refusal, choose **System**, then turn the refusal on again. Change the system
   theme. The chooser stays at **System** and the effective theme follows the system.

The [Select binding](select.mjs) forwards each native change once and reads back the effective
selection after the request. The page's [Theme Manager](theme-manager.mjs) owns the preference,
tracks the latest system theme and reports preference and effective theme changes separately.
The [host connection](theme.mjs) reads the system preference and sets the document root's
`color-scheme` style from the effective theme. The native output contains the complete
status message so live updates include its context.

## Try the note panels

The **Release notes** detail uses one Tabs model to associate Preview and History with their content.
Use these checks for the example's two enabled tabs and manual activation:

1. Reload the page. **Preview** is selected and its text panel is visible. Use Tab to enter
   the labelled horizontal tablist at the selected tab.
2. Press Right to focus **History**. The focus outline moves to History and the selection
   underline stays on Preview. Press Right again to wrap to Preview, then Left to wrap
   back to History. Moving focus leaves the visible panel unchanged.
3. Press Enter to select History and move the underline to it. Press Left to focus Preview,
   then Space to select it.
   Enter and Space use the native button click path, as does a pointer click on either tab.
   Each activation requests selection once.
4. Activate History with the pointer, then focus its tab and press Tab. Focus leaves the
   tablist for the visible text-only panel. Shift+Tab returns to the selected tab. Tab and
   Shift+Tab can also leave from a focused, unselected tab. Re-entering the tablist focuses
   the selected tab.
5. Repeat the focus and selection checks with forced colours active. The underline and
   the browser's focus outline should still be distinguishable.

The host projects `aria-selected` and panel visibility from `activeTab`. Each tab's
`aria-controls` identifies its panel and each panel's `aria-labelledby` identifies its tab.
Logical tab and panel keys are mapped to the supplied DOM identifiers. The
[Tabs binding](tabs.mjs) preserves focus during projection unless the update would hide the
focused panel; it then moves focus to the new selected tab before hiding the old panel.

The [portable Tabs contract](../../docs/en/packages/components/components/tabs/index.md)
owns selection and panel association. The page owns content and the manual host interaction,
following the [WAI manual tabs example](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-manual/).
The example is limited to enabled horizontal tabs. Other focus policies, representations and
hosts require their own interaction and accessibility checks.

## Try the independent checkbox

1. Reload the page. **Mark release notes as reviewed** starts unchecked.
2. Use Tab to focus the checkbox, then press Space. It becomes checked and focus stays on
   the control. Press Space again to clear it.
3. Click the checkbox or its visible label to mark the notes as reviewed. Select the other
   note panel and change the help or theme preference. The review choice stays checked.
   Click its label again to clear it.

The page gives this binary option its own scope and an internal
[Checking capability](../../docs/en/packages/components/capabilities/checkable/index.md).
The native input supplies checkbox semantics. Its [checked-input binding](checked-input.mjs)
forwards each native `change` once with `checked` as the requested target. Setup and effective
change notifications project the checked value. After each request, the connection reads back
the effective state, including after a refusal or failure. The review choice lasts until the
page reloads, independently of Tabs, help and theme.

## Try the sample export

1. Reload the page. **Records processed** starts at **0 of 3** and the action is
   **Process next record**.
2. Activate the action three times with the pointer, or focus it with Tab and use Enter or
   Space. Each activation processes one record. The count advances through **1 of 3** and
   **2 of 3** to **3 of 3**, and the native progress bar fills.
3. At **3 of 3**, the action becomes **Finish export** and the separate status reports
   **Export status: Ready to finish**. The export is still pending.
4. Activate **Finish export**. The status becomes **Export complete** and the
   button becomes disabled. The measurement stays at **3 of 3**. Reload to start another run.

The [sample export operation](sample-export.mjs) owns the fixed total, processed count and
finalisation result. It commits an increasing integer report in `0..3` and reports no change
for a repeat. A non-number throws `TypeError`. A non-finite, fractional, out-of-range or
decreasing count throws `RangeError` before commitment. These are policies for this simulated run.

The [native connection](export-progress.mjs) projects accepted changes into the labelled
`<progress>` and visible count. Repeated reports skip projection. The host shows application status
separately. Reaching the total permits finalisation, and the next action reports its result. Measurement
handling stays private to the example. Components supplies the existing Button for the action.

## Connection ownership

The example's [Button binding](button.mjs) reflects model availability in a native button's
`disabled` property and forwards activation to the model. The [Sidebar binding](sidebar.mjs)
connects a native disclosure button and a region, keeping `aria-expanded` and `hidden` in sync
with effective openness. The caller supplies the elements, labels and relationships between them.
The page's own Button subscriptions decide which Modal actions to request.

The Details case owns its Button and the scope borrowed by Opening. Its separate connection
owns the Button binding and the activation and opening subscriptions. Detaching that connection
ends input forwarding and projection while preserving the models and last rendered state.
Ending the case finalises its models independently of the other examples, without requesting
a synthetic close. The supplied elements retain their caller ownership.

The checkbox case owns its scope and registers its checked-input connection's detach with
that scope. The shared binding borrows the checked-state contract and its lifetime separately;
the help Switch supplies both from its existing instance. Each connection owns one native
`change` listener and one checked-state subscription. Detaching it preserves the borrowed model
and scope. Ending the checkbox case releases its connection and finalises its scope independently
of the other cases.

The Sample export case owns a local scope, its Button and the activation and native
connections. Ending the case releases those connections and disposes its Button while
preserving the last rendering and leaving the other examples available.

Each binding borrows a live model and returns an idempotent detach function. Detach attempts
to release its DOM listeners and model subscription. A detached view stops receiving model
updates. A native control that remains in the page can still respond locally. The caller can
still use the model, attach it to another view and dispose it. If setup fails, the binding
invalidates its callbacks and attempts any releases it acquired.

Both dialogues use the [Modal binding](modal.mjs) for native projection and dismissal. The
page supplies each opening policy and reconciles completed native closing through that
dialogue's own authority. It detaches the binding before closing the view during teardown.

The Theme Manager acts as Select's application authority. Detaching the chooser releases its
DOM listener and model subscription. The page retains the model and manager, and owns their
disposal, the system preference listener and the effective theme subscription.

The Tabs binding borrows the page-created model and supplied tab and panel elements. It owns
its DOM listeners and selection subscription. Detach stops event forwarding and
model projection while preserving the model and the last rendered markup. The caller can still
request selection on the model and attach another view. Failed setup invalidates acquired
callbacks before attempting their releases.

The page scope owns the connections and model instances it creates. It releases the connections
and disposes those instances when setup fails or the page leaves without entering the
back-forward cache.
