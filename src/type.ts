export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export type Folder = {
  id: number;
  name: string;
  todos: Todo[];
  folders: Folder[];
};
