import { BookingCard } from "@/components/dashboard/tenant/booking-card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { db } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/session";
import { ArrowDownRightIcon, CookingPot } from "lucide-react";
import { Suspense } from "react";

async function MyBooking() {
  const session = await getRequiredSession();
  const bookings = await db.bookingRequest.findMany({
    where: {
      tenantId: session.user.id,
      property: {
        status: "AVAILABLE",
      },
    },
    include: {
      property: true,
      owner: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (bookings.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CookingPot />
          </EmptyMedia>
          <EmptyTitle>No Booking Requests Yet</EmptyTitle>
          <EmptyDescription>
            You haven’t sent or received any booking requests so far. When you
            do, they’ll show up right here for easy tracking.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div>
      {bookings.map((booking) => (
        <BookingCard booking={booking} key={booking.id} />
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <div>
      <h1 className="md:text-4xl text-xl font-semibold mb-6">
        Your Booking Requests <ArrowDownRightIcon className="inline-block" />
      </h1>
      <Suspense fallback={<Spinner />}>
        <MyBooking />
      </Suspense>
    </div>
  );
}
