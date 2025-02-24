import { createId } from '@paralleldrive/cuid2';
import { jsonObjectFrom } from 'kysely/helpers/mysql';
import { dbClient } from './db/client';

const main = async (): Promise<void> => {
  const newUserId = createId();
  await dbClient
    .insertInto('user')
    .values([
      {
        id: newUserId,
        email: `${createId()}@example.com`,
      },
    ])
    .execute();

  const newPostId = createId();
  await dbClient
    .insertInto('post')
    .values({
      id: newPostId,
      title: 'Hello, World!',
      authorId: newUserId,
      createdAt: new Date(),
    })
    .execute();

  const usersWithPost = await dbClient
    .selectFrom('user')
    .selectAll('user')
    .select((eb) => [
      jsonObjectFrom(
        eb
          .selectFrom('post')
          .select(['post.id', 'post.title', 'post.createdAt'])
          .whereRef('post.authorId', '=', 'user.id'),
      ).as('post'),
    ])
    .where('user.id', '=', newUserId)
    .executeTakeFirstOrThrow();

  // ! This is the issue
  // The inferred type of usersWithPost.post.createdAt is Date but the actual value is a string
  console.log(
    `usersWithPost.post.createdAt is ${typeof usersWithPost.post?.createdAt}`,
  );

  // So this code throws an error at runtime
  // console.log(usersWithPost.post?.createdAt.toISOString());

  // This code works fine
  const post = await dbClient
    .selectFrom('post')
    .selectAll('post')
    .where('id', '=', newPostId)
    .executeTakeFirstOrThrow();

  console.log(`post.createdAt is ${typeof post.createdAt}`);
  console.log(post.createdAt.toISOString());

  // Close DB Connection
  await dbClient.destroy();
};

await main();
