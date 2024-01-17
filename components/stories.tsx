import { db, usersTable, storiesTable } from "@/app/db";
import { desc } from "drizzle-orm";
import { TimeAgo } from "@/components/time-ago";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { and, sql, ilike } from "drizzle-orm";
import { MoreLink } from "./more-link";
import Link from "next/link";
import { Suspense } from "react";
import Highlighter from "react-highlight-words";
import { getTableConfig } from "drizzle-orm/pg-core";
import { graphql } from "@/fuse";
import { execute } from "fuse/next/server";

const PER_PAGE = 30;
const storiesTableName = getTableConfig(storiesTable).name;

const GET_STORIES_QUERY = graphql(`
  query getStories($page: Int, $isNewest: Boolean!) {
    stories(page: $page, isNewest: $isNewest) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    edges {
      node { 
      id
      title
      url
      domain
      username
      points
      comments_count
      created_at
      submitter {
        username
      }
      }
    }
    }
  }
`)

export async function getStoriesCount() {
  // high performance, estimative count
  const statement = sql`SELECT reltuples::BIGINT AS estimate
    FROM pg_class
    WHERE relname = ${storiesTableName}`;

  const res = await db.execute(statement);
  if (!res.rows[0]) return 0;
  const row: { estimate: number } = res.rows[0] as any;
  return row.estimate ?? 0;
}

export async function getStories({
  isNewest,
  page,
  type,
  q,
  limit = PER_PAGE,
}: {
  isNewest: boolean;
  page: number;
  type: string | null;
  q: string | null;
  limit?: number;
}) {
  const result = await execute({ query: GET_STORIES_QUERY, variables: {
    page,
    isNewest,
    type,
    q,
    limit,
  } })

  return result.data?.stories?.edges?.filter(Boolean).flatMap((edge) => edge?.node || []) || [];
}

export async function Stories({
  page = 1,
  isNewest = false,
  type = null,
  q = null,
}: {
  isNewest?: boolean;
  page?: number;
  type?: string | null;
  q?: string | null;
}) {
  const uid = headers().get("x-vercel-id") ?? nanoid();
  console.time(`fetch stories ${uid}`);

  const { data, errors } = await execute({ query: GET_STORIES_QUERY, variables: {
    page,
    isNewest,
    type,
    q,
    limit: PER_PAGE,
  } })

  const stories = data?.stories?.edges?.filter(Boolean).flatMap((edge) => edge?.node || []) || []
  
  console.timeEnd(`fetch stories ${uid}`);

  const now = Date.now();
  return stories.length ? (
    <div>
      <ul className="space-y-2">
        {stories.map((story, n) => {
          return (
            <li key={story.id} className="flex gap-2">
              <span className="align-top text-[#666] md:text-[#828282] text-right flex-shrink-0 min-w-6 md:min-w-5">
                {n + (page - 1) * PER_PAGE + 1}.
              </span>
              <div>
                {story.url != null ? (
                  <a
                    className="text-[#000000] hover:underline"
                    rel={"nofollow noreferrer"}
                    target={"_blank"}
                    href={story.url}
                  >
                    {story.title}
                  </a>
                ) : (
                  <Link
                    prefetch={true}
                    href={`/item/${story.id.replace(/^story_/, "")}`}
                    className="text-[#000000] hover:underline"
                  >
                    {q == null ? (
                      story.title
                    ) : (
                      <Highlighter
                        searchWords={[q]}
                        autoEscape={true}
                        textToHighlight={story.title}
                      />
                    )}
                  </Link>
                )}
                {story.domain && (
                  <span className="text-xs ml-1 text-[#666] md:text-[#828282]">
                    ({story.domain})
                  </span>
                )}
                <p className="text-xs text-[#666] md:text-[#828282]">
                  {story.points} point{story.points > 1 ? "s" : ""} by{" "}
                  {story.submitter?.username}{" "}
                  <TimeAgo now={now} date={new Date(story.created_at)} /> |{" "}
                  <span
                    className="cursor-default"
                    aria-hidden="true"
                    title="Not implemented"
                  >
                    flag
                  </span>{" "}
                  |{" "}
                  <span
                    className="cursor-default"
                    aria-hidden="true"
                    title="Not implemented"
                  >
                    hide
                  </span>{" "}
                  |{" "}
                  <Link
                    prefetch={true}
                    className="hover:underline"
                    href={`/item/${story.id.replace(/^story_/, "")}`}
                  >
                    {story.comments_count} comments
                  </Link>
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 ml-7">
        {data?.stories?.pageInfo?.hasNextPage && <MoreLink q={q} page={page + 1} />}
      </div>
    </div>
  ) : (
    <div>No stories to show</div>
  );
}
