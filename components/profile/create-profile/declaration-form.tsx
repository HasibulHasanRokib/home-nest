"use client";

import type z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ProfileDataType } from "@/lib/types/profile-data-type";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ErrorMessage } from "@/components/error-message";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/image-upload";
import { toast } from "sonner";
import { BgRemoveImageUpload } from "@/components/bg-remove-image-upload";
import { Spinner } from "@/components/ui/spinner";
import Logo from "@/components/logo";
import { declarationFormSchema } from "@/lib/zod-schema/create-profile-schema";
import { declarationInfoAction } from "@/app/profile/create/actions";

export function DeclarationForm({
  profileData,
}: {
  profileData?: ProfileDataType;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const declarationData = profileData?.declaration as
    | z.infer<typeof declarationFormSchema>
    | undefined;

  const form = useForm<z.infer<typeof declarationFormSchema>>({
    resolver: zodResolver(declarationFormSchema),
    defaultValues: declarationData || {
      photo: "",
      signature: "",
    },
  });

  const onSubmit = (values: z.infer<typeof declarationFormSchema>) => {
    setError("");
    startTransition(async () => {
      const res = await declarationInfoAction(values);
      if (res.error) {
        setError(res.error);
      } else {
        toast("✅Success", {
          description: res.success,
        });
        router.push("/profile/create/4");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Declaration Information</CardTitle>
        <CardDescription>Please provide your details.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Photo</FormLabel>
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
                name="signature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload your signature</FormLabel>
                    <FormControl>
                      <BgRemoveImageUpload
                        defaultFile={field.value}
                        onUploadSuccess={(url) => field.onChange(url)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <ErrorMessage error={error} />
              <div className="flex w-full justify-between gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/create-profile/11")}
                  disabled={isPending}
                >
                  Previous
                </Button>

                <Button type="submit" disabled={isPending}>
                  {isPending ? <Spinner /> : "Save & Continue"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4 border-t pt-4">
        <Logo />
      </CardFooter>
    </Card>
  );
}
