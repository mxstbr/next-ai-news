import { addQueryFields, node } from 'fuse'
import { count, eq, sql } from 'drizzle-orm'

import { db, storiesTable } from '@/app/db'
import { User } from '@/types/User'

export const Story = node({
  name: 'Story',
  key: 'id',
  load(ids, ctx) {
    return Promise.all(ids.map(id => db.select().from(storiesTable).where(eq(storiesTable.id, id)).then(res => res[0] || null)))
  },
  fields: t => ({
    title: t.exposeString('title', { nullable: false }),
    url: t.exposeString('url'),
    domain: t.exposeString('domain'),
    username: t.exposeString('username'),
    points: t.exposeInt('points', { nullable: false}),
    submitter: t.field({
      type: User,
      resolve: (story) => story.submitted_by ?? story.username,
    }),
    comments_count: t.exposeInt('comments_count'),
    created_at: t.expose('created_at', {
      type: 'Date'
    }),
  })
})

addQueryFields((t) => ({
  stories: t.list({
    type: Story,
    args: {
      page: t.arg.int({ defaultValue: 1, required: true })
    },
    nodeNullable: false,
    resolve: async (_, args) => {
      const [result, totalCount] = await Promise.all([
        db.select().from(storiesTable).limit(30).offset((args.page - 1) * 30),
        await db.select({ value: count(storiesTable.id) }).from(storiesTable).then(res => res[0].value)
      ])

      return {
        totalCount,
        nodes: result,
      }
    }
  })
}))