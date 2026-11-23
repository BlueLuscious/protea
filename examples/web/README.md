# Protea Web Example

This unstyled local page connects Button, Modal, Sidebar and Switch to native HTML. Its
[import map](index.html) maps the four family specifiers to their files under
`packages/components/dist/api/families/` and `@luscious-garden/protea-components/capabilities`
to the built capability aggregate. The Core root supplies the page scope.

## Run locally

Use the [repository toolchain](../../docs/en/tooling/index.md#selected-contributor-environment).
From the repository root, install dependencies and build the packages. Rebuild after changes
to Core or Components so the example loads the current exports from `dist/`.

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

1. Activate **Open dialogue** with the mouse or keyboard. The heading names the dialogue and
   **Close dialogue** receives initial focus.
2. Activate **Close dialogue** or press Escape. An accepted request closes the dialogue and
   returns focus to the opening button.
3. Open it again, select **Refuse close requests** and press Escape. The host routes a
   cancellable `cancel` event to Modal and keeps the dialogue open when the authority refuses.
   The browser can enforce dismissal on a subsequent Escape without fresh user activation.
   The host observes the resulting `close` event and synchronises the application-owned
   opening state. See the [dialogue element](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element)
   and [close watcher infrastructure](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-infrastructure).

## Try the draft editor

1. Activate **Open editor**. Focus starts in **Draft**. Press Escape before editing to close
   the dialogue and return focus to its opener.
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

## Try the shared help preference

1. Activate **Show help** with the pointer or focus it with Tab and press Space. The switch
   shows the current preference and the help text appears.
2. Activate **Toggle help**. The help text hides and **Show help** reflects the same change.
   Either control can change the preference during the life of the page.

The [Switch binding](switch.mjs) forwards one native change and restores the effective checked
value if the request is refused. A page-owned Checking capability supplies the value. The
application's authority connects that value to Switch and to the Button's activation action.

## Connection ownership

The example's [Button binding](button.mjs) reflects model availability in a native button's
`disabled` property and forwards activation to the model. The [Sidebar binding](sidebar.mjs)
connects a native disclosure button and a region, keeping `aria-expanded` and `hidden` in sync
with effective openness. The caller supplies the elements, labels and relationships between them.
The page's own Button subscriptions decide which Modal actions to request.

Each binding borrows a live model and returns an idempotent detach function. Detach attempts
to release its DOM listeners and model subscription. A detached view stops receiving model
updates. A native control that remains in the page can still respond locally. The caller can
still use the model, attach it to another view and dispose it. If setup fails, the binding
invalidates its callbacks and attempts any releases it acquired.

Both dialogues use the [Modal binding](modal.mjs) for native projection and dismissal. The
page supplies each opening policy and reconciles completed native closing through that
dialogue's own authority. It detaches the binding before closing the view during teardown.

The page scope owns the connections and model instances it creates. It releases the connections
and disposes those instances when setup fails or the page leaves without entering the
back-forward cache.
