"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ownerInfoFormSchema } from "@/lib/zod-schema/create-profile-schema";
import { AttachmentType, Gender, Religion } from "@/lib/generated/prisma/enums";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/logo";
import { ErrorMessage } from "@/components/error-message";
import { Spinner } from "@/components/ui/spinner";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/image-upload";
import { ownerInfoAction } from "@/app/profile/create/actions";
import { toast } from "sonner";

export function OwnerInfoForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof ownerInfoFormSchema>>({
    resolver: zodResolver(ownerInfoFormSchema),
    defaultValues: {
      dateOfBirth: undefined,
      attachment1: "",
      attachment2: "",
      attachmentType: AttachmentType.NID,
      birthCertificateNumber: "",
      facebook: "",
      gender: undefined,
      linkedin: "",
      nidNumber: "",
      passportNumber: "",
      religion: undefined,
      twitter: "",
      whatsapp: "",
      occupation: "",
    },
  });

  const attachmentType = useWatch({
    control: form.control,
    name: "attachmentType",
  });

  function onSubmit(values: z.infer<typeof ownerInfoFormSchema>) {
    setError("");
    startTransition(async () => {
      const res = await ownerInfoAction(values);
      if (res.error) {
        setError(res.error);
      } else {
        toast("✅ Success", { description: res.success });
        router.push("/profile/create/2");
      }
    });
  }

  return (
    <Card className="mx-auto max-w-6xl">
      <CardHeader>
        <CardTitle>Owner personal information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* NID */}
              <FormField
                control={form.control}
                name="nidNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NID Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter NID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Birth Certificate */}
              <FormField
                control={form.control}
                name="birthCertificateNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Certificate Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Birth Certificate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passportNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Passport Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date of Birth */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown"
                          disabled={(date) => date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Occupation */}
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input placeholder="Your occupation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full capitalize">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Gender).map((g) => (
                          <SelectItem key={g} value={g} className="capitalize">
                            {g.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Religion */}
              <FormField
                control={form.control}
                name="religion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Religion</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full capitalize">
                          <SelectValue placeholder="Select religion" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Religion).map((r) => (
                          <SelectItem key={r} value={r} className="capitalize">
                            {r.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="my-10 space-y-4">
              {/* Attachment Type */}
              <FormField
                control={form.control}
                name="attachmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attachment Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full capitalize">
                          <SelectValue placeholder="Select attachment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(AttachmentType).map((a) => (
                          <SelectItem key={a} value={a} className="capitalize">
                            {a.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Attachments */}
                <FormField
                  control={form.control}
                  name="attachment1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{`${attachmentType} front side`}</FormLabel>
                      <FormControl>
                        <ImageUpload
                          onUploadSuccess={(file) => field.onChange(file)}
                          defaultFile={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="attachment2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{`${attachmentType} back side`}</FormLabel>
                      <FormControl>
                        <ImageUpload
                          onUploadSuccess={(file) => field.onChange(file)}
                          defaultFile={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Socials */}
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://facebook.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input placeholder="https://twitter.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Whatsapp</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://whatsapp.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <ErrorMessage error={error} />
            <div className="flex justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
                disabled={isPending}
              >
                Back
              </Button>

              <Button type="submit" disabled={isPending}>
                {isPending ? <Spinner /> : "Save & Continue"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <Separator />
      <CardFooter className="flex items-center justify-center">
        <Logo />
      </CardFooter>
    </Card>
  );
}
