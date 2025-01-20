import { z } from 'zod';

export type TodoItem = z.infer<typeof TodoItemSchema>;
export const TodoItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  completed: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const TodoItemsSchema = z.array(TodoItemSchema);
