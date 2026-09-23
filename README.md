# Mini Workspace Explorer

A browser-based file manager built with Next.js (App Router) and TypeScript. You can create, navigate, search, edit, rename, and delete nested folders and text files. Everything is persisted client-side — there's no backend.

## 1. Running it

```bash
npm install
npm run dev       # http://localhost:3000
```

To check the production build (this also runs the TypeScript compiler, so it's a good way to catch type errors before pushing):

```bash
npm run build
npm start
```

No env vars, no backend, no setup beyond `npm install`. All data lives in `localStorage`.

### Deploying

It's a plain Next.js app, so it deploys to Vercel with zero config:

```bash
npm i -g vercel
vercel
```

or just import the repo from the Vercel dashboard — it auto-detects Next.js and there's nothing else to configure.

## 2. Project structure

```
app/
  layout.tsx           Root layout — wraps everything in WorkspaceProvider + NavigationGuardProvider
  page.tsx              Composition root: <Sidebar/> + <MainPanel/>, owns the search query and mobile sidebar state
  globals.css            Tailwind entrypoint plus a couple of scrollbar tweaks
components/
  Sidebar.tsx            Folder tree shell. Static on desktop, slides in as an overlay on mobile
  TreeNode.tsx            Recursive folder node — expand/collapse, selection highlight, indent by depth
  Breadcrumb.tsx         Clickable "Workspace / Projects / Webbly" trail
  SearchBar.tsx          Controlled search input
  SearchResults.tsx      Workspace-wide search results, with the matched text highlighted
  FolderView.tsx         Selected folder's contents, plus the create/rename/delete UI
  FileEditor.tsx         Textarea editor — dirty tracking, save, unsaved-changes guard
  Modal.tsx               PromptModal (create/rename) and ConfirmModal (delete)
lib/
  types.ts                 All the shared types: FSItem, WorkspaceState, and component prop interfaces
  workspaceContext.tsx    The reducer + Context — single source of truth for the whole workspace
  navigationGuard.tsx     Small context that blocks navigation away from a file with unsaved edits
  storage.ts               localStorage read/write, with basic shape-checking
  seedData.ts               The example workspace from the spec, loaded the first time there's nothing in storage
  utils.ts                  Pure helpers — id generation, children/descendants/path lookup, name validation, search highlighting
```

## 3. State management

I went with **React Context + `useReducer`** instead of pulling in Redux or Zustand. A few reasons:

- Most of the app needs to read or mutate the same tree of state (`items`, `selectedFolderId`, `openFileId`), and that state doesn't map cleanly to a handful of independent slices — it's really one workspace. A single provider at the root avoids prop-drilling without adding a dependency for what's ultimately seven or eight reducer actions (`CREATE_ITEM`, `RENAME_ITEM`, `DELETE_ITEM`, `UPDATE_CONTENT`, `SELECT_FOLDER`, `OPEN_FILE`, `CLOSE_FILE`, `HYDRATE`).
- Keeping every mutation inside the reducer means things like cascading folder delete stay as one pure function I can reason about, instead of being spread across `setState` calls in different components.
- `workspaceContext.tsx` doesn't expose the raw `dispatch` — it wraps it in typed functions like `createItem` and `renameItem`. That's where name validation happens, before an action is even dispatched, so components never need to know what a valid action looks like.
- Persistence is just a side effect on top of this: one `useEffect` writes state to `localStorage` whenever it changes, and another reads it back on mount (falling back to seed data if there's nothing there). There's a `hydrated` flag guarding this — without it, the initial render with seed data would fire the save effect and overwrite whatever was actually in storage before the load effect got a chance to run.
- Unsaved-changes handling lives in its own small context (`navigationGuard.tsx`) rather than being bolted onto the main one. The open `FileEditor` registers a guard function while it's mounted, and anything that can navigate away — clicking a different folder in the sidebar, a breadcrumb link, opening another file, hitting Close — routes through `requestNavigation()` first, which runs that guard. Keeping it separate meant I didn't have to thread "is there a dirty file open right now" through every navigation-triggering component.

## 4. File-system data structure

```ts
interface FSItem {
  id: string;
  name: string;
  type: "folder" | "file";
  parentId: string | null;
  content?: string; // only set for files
  createdAt: number;
  updatedAt: number;
}

interface WorkspaceState {
  items: Record<string, FSItem>; // flat map, keyed by id
  rootId: string;
  selectedFolderId: string;
  openFileId: string | null;
}
```

I store the tree flat — a map of `id -> item`, with each item pointing at its parent — rather than nesting `children` arrays inside each folder object. That was a deliberate choice, not the default I happened to land on:

- Renaming or editing a file's content is a direct key lookup and replace. No walking the tree to find the node first.
- Deleting a folder doesn't require splicing anything out of a parent's `children` array, so there's no risk of that array drifting out of sync with reality. A cascading delete just removes every item whose `parentId` chain leads back to the deleted folder — `getDescendantIds` does this with a plain traversal over the map.
- Things like a folder's children, the breadcrumb path, and duplicate name checks are all computed on the fly (`getChildren`, `getPath`) instead of stored — one less thing that could get out of sync with the actual data.
- The root ("Workspace") is a normal item in the map, with `parentId: null`, rather than some special implicit container. That means every other operation — rename, breadcrumb rendering, children lookup — treats it the same as any other folder. It's just disabled in the UI for rename/delete, since deleting or renaming the root doesn't really make sense.

## 5. Responsive design

The sidebar behaves differently depending on viewport:

- **Desktop (`md` and up):** sits statically to the left, same as any typical file-explorer layout — sidebar and main panel side by side.
- **Mobile:** the sidebar is `position: fixed` and starts translated off-screen. A hamburger button in the main panel's header toggles it; when open, it slides in over the content with a dark backdrop behind it (tapping the backdrop closes it again). Because it's `fixed`, it's taken out of the normal document flow on mobile, so the main panel naturally takes the full width instead of sharing it with a squeezed sidebar.

I didn't want a separate mobile layout or a different component tree — just the one `Sidebar`/`MainPanel` structure, with Tailwind's `md:` breakpoint switching between "static, always visible" and "fixed, toggled overlay."

## 6. Notable edge cases

- **Duplicate names** are checked per-parent, case-insensitively, across both files and folders — a file and folder can't share a name in the same directory, same as a real filesystem. This is checked in `createItem`/`renameItem` before anything is dispatched, and the error shows up inline in the modal.
- **Empty names, or names with `/` or `\`** are rejected the same way (see `validateName` in `lib/utils.ts`).
- **Deleting a folder** removes every nested item in one reducer action. If the folder being deleted contains the currently selected folder or the currently open file, the app falls back to the parent of the deleted item (or root, if that's gone too) and closes the editor — so you never end up looking at a folder or file that no longer exists.
- **Unsaved file changes:** the editor keeps a local `draft` separate from the saved `content`, with a small dot + status line showing there's something unsaved. Navigating away from a dirty file through the app is intercepted and confirmed via `window.confirm`; closing or refreshing the tab is handled separately with `beforeunload`. I kept this to the browser's native confirm dialog rather than building a custom one — it's the one place in the app where I wanted the interaction to feel unambiguously blocking.
- **Search** matches folder and file names (case-insensitive, substring) across the entire workspace regardless of depth, since it just scans the flat `items` map. Clicking a folder result navigates to it; clicking a file result opens the parent folder and the file, with the matching text highlighted.
- **Empty folder:** deleting the last item in a folder shows an explicit "this folder is empty" state with the create actions still available, instead of a blank panel. The workspace itself can never end up fully empty, since the root folder can't be deleted.
- **Corrupted or missing localStorage:** `loadState()` does a basic shape check on the parsed JSON and falls back to the seed workspace instead of crashing on bad or outdated data.

## 7. Known limitations

- No drag-and-drop to move items between folders — create/rename/delete only, as per the spec.
- No undo for delete. It's permanent, behind a confirm dialog.
- File content is plain text only — no formatting, no other file types, no size limits.
