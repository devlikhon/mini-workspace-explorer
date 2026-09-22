import { FSItem, ROOT_ID, WorkspaceState } from "./types";

// Builds the example workspace:

export const buildSeedState = (): WorkspaceState => {
  const now = Date.now();
  const item = (partial: Omit<FSItem, "createdAt" | "updatedAt">): FSItem => ({
    ...partial,
    createdAt: now,
    updatedAt: now,
  });

  const items: Record<string, FSItem> = {};
  const add = (i: FSItem) => (items[i.id] = i);

  add(item({ id: ROOT_ID, name: "Workspace", type: "folder", parentId: null }));

  add(
    item({
      id: "projects",
      name: "Projects",
      type: "folder",
      parentId: ROOT_ID,
    }),
  );

  add(
    item({
      id: "webbly",
      name: "Webbly",
      type: "folder",
      parentId: "projects",
    }),
  );

  add(
    item({
      id: "notes-txt",
      name: "notes.txt",
      type: "file",
      parentId: "webbly",
      content:
        "Kickoff notes:\n- Define scope\n- Assign owners\n- Set milestones\n",
    }),
  );

  add(
    item({
      id: "tasks-txt",
      name: "tasks.txt",
      type: "file",
      parentId: "webbly",
      content:
        "TODO:\n[ ] Wireframes\n[ ] API contract\n[ ] Review with team\n",
    }),
  );

  add(
    item({
      id: "personal",
      name: "Personal",
      type: "folder",
      parentId: "projects",
    }),
  );

  add(
    item({
      id: "documents",
      name: "Documents",
      type: "folder",
      parentId: ROOT_ID,
    }),
  );

  add(
    item({
      id: "readme-txt",
      name: "README.txt",
      type: "file",
      parentId: ROOT_ID,
      content:
        "Welcome to Mini Workspace Explorer!\n\nThis is a sample file. Try editing it, " +
        "or use the toolbar above to create your own folders and files.\n",
    }),
  );

  return {
    items,
    rootId: ROOT_ID,
    selectedFolderId: ROOT_ID,
    openFileId: null,
  };
};
