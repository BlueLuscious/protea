# Protea Web Example

This unstyled local page connects Button, Modal and Sidebar to native HTML. Its import map
resolves the public Core and Components entries from their built output.

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

## Try supplementary navigation

1. Activate **Supplementary navigation** with the mouse or keyboard. The labelled navigation
   region appears in the normal page flow and the button reports `aria-expanded="true"`.
   With the button focused, press Tab to reach the navigation link.
2. Activate the button again. The region is hidden and the button reports
   `aria-expanded="false"`. Both attributes follow Sidebar's effective open state.

## Connection ownership

The [example's Sidebar connection](sidebar.mjs) borrows the supplied model. Its detach operation
releases the DOM listener and the model subscription. Repeated detach calls are safe. The
borrowed model stays active and its owner can still request changes and dispose it. Its changes
stop reaching the detached view, which keeps its last projected state.

The page scope owns the connections and model instances it creates. It releases the connections
and disposes those instances when setup fails or the page leaves without entering the
back-forward cache.
