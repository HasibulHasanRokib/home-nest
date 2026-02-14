import { db } from "@/lib/prisma";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { ArrowDownRightIcon, CookingPot } from "lucide-react";
import { UsersTable } from "@/components/dashboard/admin/users-table";
import { PaginationControl } from "@/components/pagination-control";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function UsersList({ searchParams }: { searchParams: SearchParams }) {
  const usersSearchParams = await searchParams;
  const page = Number(usersSearchParams.page) || 1;
  const limit = Number(usersSearchParams.limit) || 10;
  const offset = (page - 1) * limit;

  const [users, totalUsers] = await Promise.all([
    db.user.findMany({
      where: {
        role: {
          not: "ADMIN",
        },
      },
      include: {
        properties: true,
        packages: {
          where: { active: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
    }),
    db.user.count({
      where: {
        role: {
          not: "ADMIN",
        },
      },
    }),
  ]);

  if (users.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center ">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CookingPot />
            </EmptyMedia>
            <EmptyTitle>No User create Yet</EmptyTitle>
            <EmptyDescription>
              You haven’t any user so far. When user create account, you will
              show up right here for easy tracking.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <UsersTable users={users} />
      <PaginationControl
        page={page}
        limit={limit}
        total={totalUsers}
        pathname="/dashboard/admin/users"
      />
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page } = await searchParams;
  return (
    <div>
      <h1 className="md:text-4xl text-xl font-semibold mb-10">
        User Management & Approvals{" "}
        <ArrowDownRightIcon className="inline-block" />
      </h1>
      <div>
        <Suspense key={Number(page) || 1} fallback={<Spinner />}>
          <UsersList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
