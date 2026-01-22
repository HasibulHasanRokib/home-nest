import { createCanvas, loadImage, Image } from "canvas";

type PropertyPayment = {
  templatePath: string;
  paymentId: string;
  paymentMethod: string;
  date: string;

  tenantName: string;
  tenantNid: string;
  tenantEmail: string;
  tenantPhone: string;
  tenantAddress: string;

  ownerName: string;
  ownerNid: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerAddress: string;

  propertyTitle: string;
  propertyAddress: string;

  ownerSignaturePath: string;
  tenantSignaturePath: string;
};

export const generatePropertyPaymentReceipt = async ({
  templatePath,
  paymentId,
  paymentMethod,
  date,
  tenantName,
  tenantNid,
  tenantEmail,
  tenantPhone,
  tenantAddress,
  ownerName,
  ownerNid,
  ownerEmail,
  ownerPhone,
  ownerAddress,
  propertyTitle,
  propertyAddress,

  ownerSignaturePath,
  tenantSignaturePath,
}: PropertyPayment) => {
  const [template, owner_signature, tenant_signature]: [Image, Image, Image] =
    await Promise.all([
      loadImage(templatePath),
      loadImage(ownerSignaturePath),
      loadImage(tenantSignaturePath),
    ]);

  const canvas = createCanvas(template.width, template.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(template, 0, 0);

  ctx.font = " 15px ";
  ctx.fillStyle = "#0f172a";

  ctx.fillText(paymentId, 530, 30);
  ctx.fillText(paymentMethod, 530, 50);
  ctx.fillText(date, 530, 70);

  ctx.fillText(tenantName, 50, 200);
  ctx.fillText(tenantNid, 50, 220);
  ctx.fillText(tenantEmail, 50, 240);
  ctx.fillText(tenantPhone, 50, 260);
  ctx.fillText(tenantAddress, 50, 280);

  ctx.fillText(ownerName, 515, 200);
  ctx.fillText(ownerNid, 515, 220);
  ctx.fillText(ownerEmail, 515, 240);
  ctx.fillText(ownerPhone, 515, 260);
  ctx.fillText(ownerAddress, 515, 280);

  ctx.fillText(propertyTitle, 50, 400);
  ctx.fillText(propertyAddress, 600, 400);

  const tX = 50;
  const tY = 440;
  const tW = 130;
  const tH = 130;

  ctx.save();
  ctx.drawImage(tenant_signature, tX, tY, tW, tH);
  ctx.restore();

  const oX = 540;
  const oY = 440;
  const oW = 130;
  const oH = 130;

  ctx.save();
  ctx.drawImage(owner_signature, oX, oY, oW, oH);
  ctx.restore();

  const buffer = canvas.toBuffer("image/png");
  return buffer;
};
