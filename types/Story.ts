import { addQueryFields, node } from 'fuse'
import { count, eq, sql } from 'drizzle-orm'

import { db, storiesTable } from '@/app/db'

export const Story = node({
  name: 'Story',
  key: 'id',
  load(ids, ctx) {
    return Promise.all(ids.map(id => db.select().from(storiesTable).where(eq(storiesTable.id, id)).then(res => res[0] || null)))
  },
  fields: t => ({
    title: t.exposeString('title')
  })
})

addQueryFields((t) => ({
  stories: t.list({
    type: Story,
    resolve: async () => {
      const [result, totalCount] = await Promise.all([
        db.select().from(storiesTable).limit(10).offset(0),
        await db.select({ value: count(storiesTable.id) }).from(storiesTable).then(res => res[0].value)
      ])

      return {
        totalCount,
        nodes: result,
      }
    }
  })
}))