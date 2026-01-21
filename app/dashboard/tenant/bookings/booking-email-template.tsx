interface EmailTemplateProps {
  propertyName: string;
  tenantName: string;
  ownerName: string;
}

export function BookingEmailTemplate({
  ownerName,
  propertyName,
  tenantName,
}: EmailTemplateProps) {
  return (
    <div>
      <h1>Hi {ownerName},</h1>
      <p>
        You have received a new booking request for your property{" "}
        <strong>{propertyName}</strong>.
      </p>
      <p>
        <strong>{tenantName}</strong> is interested in renting your property.
      </p>

      <p>
        Please log in to your dashboard to review and respond to this request.
      </p>

      <p>
        Thanks,
        <br />
        HomeNest Team
      </p>
    </div>
  );
}

export default BookingEmailTemplate;
