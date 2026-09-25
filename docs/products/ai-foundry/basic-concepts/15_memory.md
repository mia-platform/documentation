---
id: memory
title: Memory
sidebar_label: Memory
---

# Memory

**Memory** gives agents long-term recall across conversations. Agents can recall what you told them in earlier sessions, such as your preferences, decisions, and the constraints of your work, without you having to repeat them.

Unlike the other building blocks, memory entries are not catalog items. They belong to a person, not to an agent or a session, and are stored by a dedicated memory service scoped to your tenant. The same entries are available in every conversation you have with an agent, from the **Memory** page in AI Foundry, and from coding assistants connected through MCP.

## Memory entry reference

Each memory entry is a small Markdown document with the following fields.

| Field         | Type             | Required | Description                                                                                                                             |
| ------------- | ---------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | string           | No       | The entry's name, up to 120 characters. Derived from the first sentence of the body when empty.                                        |
| `description` | string           | No       | One line for the index, up to 300 characters. Derived from the first line of the body when empty.                                      |
| `entry_type`  | string           | No       | The kind of entry: `user`, `feedback`, `project` (default), or `reference`. See [Entry kinds](#entry-kinds).                           |
| `text`        | string (Markdown) | Yes     | The body, up to 16,000 characters. Write `[[another-entry]]` to link to another entry.                                                 |
| `links`       | array of strings | No       | Related entries, up to 50. Links written as `[[...]]` in the body are added automatically.                                              |
| `owner`       | string           | -        | The person the entry belongs to. Set by the platform from your identity.                                                                |
| `author`      | string           | -        | Who wrote the content, for example you or an agent. Set by the platform.                                                                |
| `occurred_at` | string           | -        | When the remembered event happened, for entries filed from a conversation. Set by the platform.                                         |
| `updated_by`  | string           | -        | Who last edited the entry, which can be a colleague with write access. Set by the platform.                                             |

### Entry kinds

The four kinds are the same ones used by Claude Code's own memory, so entries exported from AI Foundry fit naturally into it:

- `user`: who you are, such as your role, expertise, and standing preferences.
- `feedback`: guidance you gave about how work should be done, with its reason.
- `project`: ongoing work, goals, and constraints.
- `reference`: a pointer to something external, such as a URL, a dashboard, or a ticket.

## How agents use memory

Memory is enabled per installation by the administrator. When it is enabled, every agent can use it. Agents get three memory tools:

| Tool            | What it does                                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| `load_memory`   | Searches your memory for entries relevant to the current request.                                        |
| `list_memories` | Lists your most recent entries, for requests such as "what do you remember about me?".                   |
| `remember`      | Stores a new entry on purpose, for example when you ask the agent to remember something.                 |

Search is semantic, based on embeddings, when the installation has an embedding model configured; otherwise, it ranks entries by keyword overlap. Entries that colleagues shared with you are recalled too, with their author attached.

### Automatic extraction

When the installation administrator configures an extraction model, AI Foundry also distills durable facts from your conversations automatically. Every few turns (four by default), a model reads the turns not yet considered and proposes at most five facts, each up to 300 characters, written in the same language as the conversation.

Only facts that stay true and useful in a later conversation are kept, such as a stated preference, a decision, or a recurring constraint. Greetings, questions, the state of the current task, and anything the assistant only inferred are skipped, and most conversations produce no new entry at all. Extracted facts are stored as your own private entries, and you can review and delete them from the **Memory** page.

Without an extraction model, nothing is remembered automatically, and the `remember` tool is the only way agents add entries.

## Managing your memory

The **Memory** page, in the **Building Blocks** section of the sidebar, lists what agents remember for you and the entries colleagues shared with you. The table shows the **Memory** (title and description), **Tags** (the entry kind), **Owner**, **Shared** status, and **Last changed** date. From this page you can:

- **Search** your memory the way an agent would, and use **Only mine** to hide entries shared with you.
- Add an entry by hand with **Remember something**, choosing its title, description, kind, and Markdown body.
- Edit an entry you own or one shared with you with write access.
- **Download** your memory as a `MEMORY.md` tree in the format expected by your editor, such as Claude Code or GitHub Copilot.
- **Erase all of mine**: delete every entry you own and drop every access others gave you. Entries owned by other people are not affected, and the operation cannot be undone.

### Sharing entries

Entries are private by default. The owner can share an individual entry with colleagues from the **Who can see this** dialog, searching them by name or e-mail. Each share grants read-only access, or write access when **They can edit it too** is selected.

- Only the owner can delete an entry or change who can see it; a colleague with write access can edit its content.
- Entries you do not own are marked **Shared with you**, and **Read-only** when you cannot edit them, and always show who wrote them and when.
- Sharing is limited to colleagues in the same tenant.

### Privacy

- Every entry is owned by the person it was created for, taken from their authenticated identity, never from a value an agent or a client can supply.
- Values stored under credential-like field names, such as passwords, tokens, and API keys, are redacted before an entry is stored, so they cannot be revealed later.

## Using memory from coding assistants

Memory is also exposed through an MCP endpoint, so coding assistants such as Claude Code and GitHub Copilot can read and write the same entries. After signing in, the assistant gets tools such as `search_memory`, `list_memories`, `add_memory`, `update_memory`, `delete_memory`, `share_memory`, `unshare_memory`, and `list_shares`, which follow the same ownership and sharing rules as the **Memory** page. Ask your administrator for the endpoint address of your installation.

## See also

- [Agent](/products/ai-foundry/basic-concepts/20_agent.md): the actors that recall and store memory entries.
- [MCP Server](/products/ai-foundry/basic-concepts/14_mcp-server.md): how AI Foundry connects to MCP servers.
- [Guardrail](/products/ai-foundry/basic-concepts/17_guardrail.md): checks that run on the traffic between agents and models.
- [Playbook](/products/ai-foundry/basic-concepts/21_playbook.md): multi-agent flows whose agents share the same memory.
