interface EmailTemplateProps {
  otp: number;
}

export function OtpEmailTemplate({ otp }: EmailTemplateProps) {
  return (
    <div>
      <p>Your email verified otp is {otp}</p>
    </div>
  );
}

export default OtpEmailTemplate;
