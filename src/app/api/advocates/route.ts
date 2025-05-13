import { year } from "drizzle-orm/mysql-core";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { count, or, ilike, sql, gte } from "drizzle-orm";

export async function GET(request: Request) {
  // TODO - Pagination/offset
  const limit = 200;

  const params = Object.fromEntries(new URL(request.url).searchParams);
  const search = `%${params.search}%`;
  const yearsOfExperience = Number(params.search);

  const data = await db
    .select()
    .from(advocates)
    .where(
      search
        ? or(
            sql<string>`${advocates.firstName} || ' ' || ${advocates.lastName} ilike ${search}`,
            ilike(advocates.city, search),
            ilike(advocates.degree, search),
            !Number.isNaN(yearsOfExperience)
              ? gte(advocates.yearsOfExperience, yearsOfExperience)
              : undefined,
            sql<string>`${advocates.specialties}::text ILIKE ${search}`
          )
        : undefined
    )
    .limit(limit);
  const totalRows = await db.select({ value: count() }).from(advocates);

  return Response.json({
    data,
    limit,
    total: totalRows[0].value,
  });
}
