import { createId } from '@paralleldrive/cuid2';
import { jsonObjectFrom } from 'kysely/helpers/mysql';
// import type { SelectQueryBuilderExpression } from '../node_modules/kysely/dist/esm/query-builder/select-query-builder-expression';
import { dbClient } from './db/client';

// type ExactPostType = {
//   id: string;
//   title: string;
//   postedAt: string;
// };

const resetTables = async (): Promise<void> => {
  // Delete all rows from the tables
  await dbClient.transaction().execute(async (trx) => {
    await trx.deleteFrom('post').execute();
    await trx.deleteFrom('user').execute();
  });
};

const main = async (): Promise<void> => {
  await resetTables();

  const userId = createId();
  await dbClient
    .insertInto('user')
    .values([
      {
        id: userId,
        email: `${createId()}@example.com`,
      },
    ])
    .execute();

  const postId = createId();
  await dbClient
    .insertInto('post')
    .values({
      id: postId,
      title: 'Hello, World!',
      authorId: userId,
      postedAt: new Date(),
    })
    .execute();

  const userWithPost = await dbClient
    .selectFrom('user')
    .selectAll('user')
    .select((eb) => [
      jsonObjectFrom(
        eb
          .selectFrom('post')
          .select(['post.id', 'post.title', 'post.postedAt'])
          .whereRef('post.authorId', '=', 'user.id'),
      ).as('post'),
      // jsonObjectFrom<ExactPostType>(
      //   eb
      //     .selectFrom('post')
      //     .select(['post.id', 'post.title', 'post.postedAt'])
      //     .whereRef(
      //       'post.authorId',
      //       '=',
      //       'user.id',
      //     ) as unknown as SelectQueryBuilderExpression<ExactPostType>,
      // ).as('post'),
    ])
    .where('user.id', '=', userId)
    .executeTakeFirstOrThrow();

  // ! This is the issue
  // The inferred type of userWithPost.post.postedAt is Date but the actual value is a string
  console.log(
    `userWithPost.post.postedAt is ${typeof userWithPost.post?.postedAt}`,
  );

  // So this code throws an error at runtime
  // console.log(userWithPost.post?.postedAt.toISOString());

  // This code works fine
  const post = await dbClient
    .selectFrom('post')
    .selectAll('post')
    .where('id', '=', postId)
    .executeTakeFirstOrThrow();

  console.log(`post.postedAt is ${typeof post.postedAt}`);
  console.log(post.postedAt.toISOString());

  // Close DB Connection
  await dbClient.destroy();
};

await main();
