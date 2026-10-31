# Repository Automation

Status: **Workflow source configured; hosted execution and notification receipt unverified**

This guide owns Protea's CI and Discord automation. [Repository tooling](../index.md) owns the
contributor environment, commands and their actual coverage. Workflow files own exact triggers,
conditions, action references and payloads.

## Continuous integration

[ci.yaml](../../../../.github/workflows/ci.yaml) defines `Continuous Integration` for `push` and
`pull_request` events. Its independent matrix jobs are named `Verify repository (ubuntu-latest)`
and `Verify repository (windows-latest)`; matrix fail-fast is disabled. Keep these names stable
when referring to checks or selecting notifications.

Each job selects Node from [.node-version](../../../../.node-version) and pnpm from
[`package.json#packageManager`](../../../../package.json). The pnpm cache uses
[pnpm-lock.yaml](../../../../pnpm-lock.yaml). It runs `pnpm install --frozen-lockfile` followed by
`pnpm run verify`, using the same root gate described by repository tooling.

The workflow grants `contents: read`, checks out without persisted credentials and limits each
job to 15 minutes. Its concurrency group combines the workflow and ref; a newer matching run
cancels the superseded run. Action references currently use version 6 tags, which are mutable
references rather than immutable commit pins.

These jobs check contributor configuration and formatting. They do not establish component
behaviour, browser support, product compilation or runtime test coverage.

## Discord notifications

[discord.yaml](../../../../.github/workflows/discord.yaml) defines `Protea Discord Notifications`
independently of the CI gate. It runs on `ubuntu-latest` with `permissions: {}` and uses event data
without checking out repository code or downloading workflow artefacts.

| Event          | Notification selection                                                                                                                         |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `push`         | `master`, `develop` and the admitted topic-branch prefixes in the workflow; commit and branch-creation steps retain their existing conditions. |
| `pull_request` | PRs targeting `master` or `develop`, for `opened`, `reopened`, `synchronize` and `closed`.                                                     |
| `workflow_run` | Completed runs of `Continuous Integration`, with their reported conclusion.                                                                    |
| `delete`       | The workflow receives deletion events; its lifecycle step selects deleted branches.                                                            |

The workflow owns the complete prefix allowlist and step predicates. Deletion notices and the
existing push/deletion conditions are intentional parts of the retained behaviour. Push payloads
label `master` as `Production`, `develop` as `Development` and other admitted branches as `Local`;
these presentation labels provide no independent deployment evidence.

Only the workflow display name and webhook secret identifier differ from the reused Aster
notification source. The event filters, lifecycle handling and payload logic remain intact.

## Configuration and availability

Discord expects the repository Actions secret `PROTEA_DISCORD_WEBHOOK`, exposed to the job as
`DISCORD_WEBHOOK`. Keep its value outside repository content and logs. Its configuration and
availability have not been inspected or established by adding these source files.

Every sending step checks for an empty webhook value and exits successfully with a skip message
when it is unavailable. A successful notification workflow can therefore mean that nothing was
sent. GitHub withholds repository secrets from direct
[`pull_request` runs originating in forks](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflows-in-forked-repositories),
so those steps follow the same missing-secret path. A later `workflow_run` has its own context
and may receive secrets independently. See GitHub's
[secret availability rules](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets#using-secrets-in-a-workflow)
and [`workflow_run` behaviour](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_run).

GitHub evaluates the [`delete`](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#delete)
and [`workflow_run`](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_run)
triggers only after the notification workflow is present on the default branch, currently
`master`. A copy confined to a topic branch or `develop` does not activate those triggers.

## Verification and readback

Review workflow structure, action inputs, shell/expression boundaries, event conditions and the
exact retained source differences locally. The root gate checks workflow formatting; passing it
does not execute GitHub Actions or prove notification delivery.

Hosted CI evidence must identify successful Ubuntu and Windows jobs for the reviewed source,
the PR's tested revision and the exact integrated `develop` and `master` revisions. Compare the
integrated contents with the reviewed source and inspect any differences. A green result on
another revision or platform does not supply that evidence.

Before reporting live notification delivery, identify the triggering event and workflow revision,
confirm that its sending step executed without the missing-secret skip and verify receipt
independently. Source review, hosted CI, operational configuration and receipt are separate facts.
Webhook setup and live transmission remain outside the current source-setup work; no hosted run
or delivery success is claimed here.
