# Mention Groups — Trello Power-Up

A React + Vite Trello Power-Up project matching the supplied Mention Groups wireframes. The default local URL opens the actual UI (not a placeholder landing page).

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the URL Vite prints (normally `http://localhost:5173/`). The default page is the full Mention Groups UI. It runs with a local mock Trello client when opened outside Trello and stores demo data in browser localStorage.

Useful pages:
- `/` — full Mention Groups UI (default)
- `/groups.html` — group manager popup
- `/mention.html` — card-level mention picker
- `/auth.html` — authorization popup
- `/powerup.html` — Trello Power-Up connector
- `/status.html` — project/service links

## Build

```bash
npm run build
npm run preview
```

## Connect to Trello

1. Create/configure a Power-Up in the [Trello Power-Up Admin Portal](https://trello.com/power-ups/admin).
2. Set `VITE_TRELLO_APP_KEY` in `.env` to your own Trello API key (the committed value is only a placeholder).
3. Deploy the built site to a public HTTPS host such as Vercel.
4. Set the deployed `/powerup.html` URL as the connector URL in Trello Admin and configure allowed origins/authorization URLs as required.
5. Enable the needed Trello capabilities and authorize the Power-Up on a test board.

## Included UI and behavior

- First-time empty state and group creation
- Member search and multi-select
- Group list, details, edit and member management
- Duplicate and delete actions
- Local demo persistence outside Trello
- Trello board-shared storage adapter
- Card-level group picker / comment workflow scaffolding
- Light/dark theme adaptation and responsive popup styling

## Important integration note

Trello Power-Up capabilities and comment behavior depend on the permissions and APIs enabled for your Power-Up. Test posting/notifications on a dedicated Trello test board after setting your key and authorization. The local mock mode is for UI/interaction testing, not for sending real Trello notifications.

## UI verification checklist

The groups manager is designed around the supplied Mention Groups wireframes:

- Empty state: explains the feature and opens Create Group.
- My Groups: lists groups, member counts, avatars, and a create action aligned with the heading.
- Create Group: validates the name, prevents duplicate names, searches board members, and requires at least one selected member.
- Success state: confirms the group and offers navigation back to the list or creation of another group.
- Group details: lists members, supports removing members, and exposes edit, duplicate, and delete actions.
- Edit Group: reuses the member picker and validates changes before saving.
- Delete confirmation: asks before deleting.
- Mention picker: lets a user search for a group, preview who will be notified, add an optional comment, and post through Trello after authorization.

When opened directly in a browser, the project uses sample board members and localStorage. Inside Trello, it uses the Power-Up iframe client and board-shared storage. A production deployment still requires a valid Trello API key, authorization, and a deployed HTTPS URL.

### Local interaction smoke test

1. Run `npm install` and `npm run dev`.
2. Open `http://localhost:5173/`.
3. Create a group with a unique name and at least one member.
4. Use **Go to My Groups**, open the group, remove a member, edit the name, duplicate it, and test delete confirmation.
5. Open `http://localhost:5173/mention.html` to test the local mention flow. In mock mode, posting is simulated and does not create a real Trello comment.
