"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  ShieldCheck,
  MapPin,
  Home,
  Bed,
  Bath,
  Maximize,
  Printer,
  Download,
  FileText,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Prisma } from "@/lib/generated/prisma/client";
import { Logo } from "@/components/logo";
import { RefundRequest } from "./refund-request";

type PaymentWithRelation = Prisma.PaymentGetPayload<{
  include: {
    user: {
      include: {
        profile: true;
        declaration: true;
      };
    };
    rental: {
      include: {
        property: {
          include: {
            owner: {
              include: {
                profile: true;
                declaration: true;
              };
            };
          };
        };
      };
    };
  };
}>;

interface Props {
  data: PaymentWithRelation;
}

export function PaymentReceipt({ data }: Props) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Receipt-${data.transactionId}`,
  });

  const tenant = data.user;
  const property = data.rental?.property;
  const owner = property?.owner;

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={componentRef}
        className=" min-w-4xl p-6 min-h-screen bg-white shadow-2xl border rounded-sm text-slate-900 overflow-hidden relative"
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <h1 className="text-[120px] font-black -rotate-45">PAID</h1>
        </div>

        <div className="flex justify-between items-start border-b-2 border-primary pb-6">
          <div className="space-y-1">
            <Logo />
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              Verified Transaction Document
            </p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm font-bold">
              Receipt ID:{" "}
              <span className="text-primary">
                {data.id.slice(-10).toUpperCase()}
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground font-medium uppercase">
              {formatDate(data.createdAt)}
            </p>
          </div>
        </div>

        <div className="my-10 grid grid-cols-3 items-center bg-slate-50 p-6 rounded-xl border border-slate-100">
          <div className="col-span-2">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
              Payment For
            </p>
            <h3 className="text-lg font-bold leading-tight">
              {data.description || `Monthly Rent for ${property?.title}`}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              TXN: {data.transactionId}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-black text-slate-900">
              ৳{data.amount.toLocaleString("en-BD")}
            </h2>
            <div className="flex items-center justify-end gap-1.5 text-emerald-600 mt-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase">
                Paid & Secured
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <h4 className="text-[11px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
            <Home className="w-3 h-3" /> Property Specifications
          </h4>
          <div className="grid grid-cols-4 gap-4">
            <div className="border rounded-lg p-3 text-center bg-white ">
              <Bed className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="text-[10px] text-muted-foreground uppercase font-bold">
                Bedrooms
              </p>
              <p className="text-sm font-black">{property?.bedrooms} Rooms</p>
            </div>
            <div className="border rounded-lg p-3 text-center bg-white">
              <Bath className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="text-[10px] text-muted-foreground uppercase font-bold">
                Bathrooms
              </p>
              <p className="text-sm font-black">{property?.bathrooms} Units</p>
            </div>
            <div className="border rounded-lg p-3 text-center bg-white">
              <Maximize className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="text-[10px] text-muted-foreground uppercase font-bold">
                Area
              </p>
              <p className="text-sm font-black">{property?.sqft} SQFT</p>
            </div>
            <div className="border rounded-lg p-3 text-center bg-white">
              <FileText className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="text-[10px] text-muted-foreground uppercase font-bold">
                Type
              </p>
              <p className="text-sm font-black capitalize">
                {property?.propertyType?.toLowerCase()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {property?.amenities?.map((item: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1  text-[10px] font-bold rounded-full text-slate-600 border border-slate-200"
              >
                • {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 py-8 border-y border-slate-100">
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Tenant Details
            </h4>
            <div className="flex items-center gap-3">
              <img
                src={tenant.image || ""}
                className="w-10 h-10 rounded-full border"
                alt="Image"
              />
              <div>
                <p className="text-sm font-bold uppercase">{tenant.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  NID: {tenant.profile?.nidNumber}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3 border-l pl-10">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Owner Details
            </h4>
            <div className="flex items-center gap-3">
              <img
                src={owner?.image || ""}
                className="w-10 h-10 rounded-full border"
                alt="Image"
              />
              <div>
                <p className="text-sm font-bold uppercase">{owner?.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  PH: {owner?.profile?.mobileNumber}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-20 mt-16 text-center">
          <div className="space-y-2">
            <div className="h-14 flex items-end justify-center">
              <img
                src={tenant.declaration?.signature || ""}
                className="h-full object-contain grayscale"
                alt="Image"
              />
            </div>
            <p className="text-[10px] font-bold border-t pt-2 uppercase">
              Tenant Signature
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-14 flex items-end justify-center">
              <img
                src={owner?.declaration?.signature || ""}
                className="h-full object-contain grayscale"
                alt="image"
              />
            </div>
            <p className="text-[10px] font-bold border-t pt-2 uppercase">
              Authorized Owner Signature
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 w-full left-0 p-6 ">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground opacity-70">
            <MapPin className="w-3 h-3" />
            <span>Property Location: {property?.location}</span>
          </div>
          <p className="mt-4 text-[9px] text-center text-slate-400 border-t pt-4">
            HomeNest Platform (Escrow Guaranteed). This is a legal document
            confirming rent payment.
          </p>
        </div>
      </div>
      <div className="flex gap-4 no-print">
        <Button
          onClick={() => handlePrint()}
          variant="outline"
          className="gap-2"
        >
          <Printer className="w-4 h-4" /> Print Receipt
        </Button>
        <Button onClick={() => handlePrint()} className="gap-2 bg-primary">
          <Download className="w-4 h-4" /> Download PDF
        </Button>
        <RefundRequest paymentId={data.id} />
      </div>
    </div>
  );
}
