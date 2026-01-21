interface EmailTemplateProps {
  propertyName: string;
  tenantName: string;
  ownerName: string;
  status: "APPROVED" | "REJECTED";
}

export function BookingStatusEmailTemplate({
  ownerName,
  propertyName,
  tenantName,
  status,
}: EmailTemplateProps) {
  const isApproved = status === "APPROVED";
  return (
    <div>
      <p>Hi {tenantName},</p>

      {isApproved ? (
        <>
          <p>
            Great news! 🎉 Your booking request for{" "}
            <strong>{propertyName}</strong> has been <strong>approved</strong>{" "}
            by {ownerName}.
          </p>

          <p>
            Please log in to your dashboard to view the next steps and complete
            the process.
          </p>
        </>
      ) : (
        <>
          <p>
            Unfortunately, your booking request for{" "}
            <strong>{propertyName}</strong> has been <strong>rejected</strong>{" "}
            by {ownerName}.
          </p>

          <p>
            Don’t worry — you can explore other available properties on our
            platform.
          </p>
        </>
      )}

      <p>
        Best regards,
        <br />
        HomeNest Team
      </p>
    </div>
  );
}

export default BookingStatusEmailTemplate;
