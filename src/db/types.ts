import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Post = {
  id: string;
  title: string;
  authorId: string;
  createdAt: Generated<Timestamp>;
};
export type User = {
  id: string;
  email: string;
};
// biome-ignore lint/style/useNamingConvention: <explanation>
export type DB = {
  post: Post;
  user: User;
};
