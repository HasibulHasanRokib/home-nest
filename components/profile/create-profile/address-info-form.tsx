"use client";

import z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

import { ErrorMessage } from "@/components/error-message";
import { useRouter } from "next/navigation";
import { ProfileDataType } from "@/lib/types/profile-data-type";
import {
  getDistrictsByDivision,
  getDivisions,
  getPostCodeByPostOffice,
  getPostOfficesByUpazila,
  getUpazilasByDistrict,
} from "@/components/profile/create-profile/address-data";
import { Checkbox } from "@/components/ui/checkbox";
import { addressInfoFormSchema } from "@/lib/zod-schema/create-profile-schema";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/logo";
import { addressInfoAction } from "@/app/profile/create/actions";
import { useWatch } from "react-hook-form";
import { toast } from "sonner";

type Division = { id: string; name: string };
type District = { id: string; name: string };
type Upazila = { id: string; name: string };
type PostOffice = { id: string; name: string; postCode: string };

export function AddressInfoForm({
  profileData,
}: {
  profileData?: ProfileDataType;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [presentDistricts, setPresentDistricts] = useState<District[]>([]);
  const [presentUpazilas, setPresentUpazilas] = useState<Upazila[]>([]);
  const [presentPostOffices, setPresentPostOffices] = useState<PostOffice[]>(
    []
  );

  const [permanentDistricts, setPermanentDistricts] = useState<District[]>([]);
  const [permanentUpazilas, setPermanentUpazilas] = useState<Upazila[]>([]);
  const [permanentPostOffices, setPermanentPostOffices] = useState<
    PostOffice[]
  >([]);

  const [sameAsPresent, setSameAsPresent] = useState(false);

  const addressInfo = profileData?.address;

  const form = useForm<z.infer<typeof addressInfoFormSchema>>({
    resolver: zodResolver(addressInfoFormSchema),
    defaultValues: addressInfo || {
      presentDivision: "",
      presentDistrict: "",
      presentUpazila: "",
      presentPostOffice: "",
      presentPostCode: "",
      presentDetails: "",
      permanentDivision: "",
      permanentDistrict: "",
      permanentUpazila: "",
      permanentPostOffice: "",
      permanentPostCode: "",
      permanentDetails: "",
    },
  });

  const handleSameAsPresentToggle = (checked: boolean) => {
    setSameAsPresent(checked);

    if (checked) {
      const present = form.getValues([
        "presentDivision",
        "presentDistrict",
        "presentUpazila",
        "presentPostOffice",
        "presentPostCode",
        "presentDetails",
      ]);

      form.setValue("permanentDivision", present[0]);
      form.setValue("permanentDistrict", present[1]);
      form.setValue("permanentUpazila", present[2]);
      form.setValue("permanentPostOffice", present[3]);
      form.setValue("permanentPostCode", present[4]);
      form.setValue("permanentDetails", present[5]);
    }
  };

  const onSubmit = (values: z.infer<typeof addressInfoFormSchema>) => {
    setError("");
    startTransition(async () => {
      const res = await addressInfoAction(values);
      if (res.error) {
        setError(res.error);
      } else {
        toast("✅ Success", { description: res.success });
        router.push("/profile/create/3");
      }
    });
  };

  const [
    presentSelectedDivision,
    presentSelectedDistrict,
    presentSelectedUpazila,
    presentSelectedPostOffice,
    permanentSelectedDivision,
    permanentSelectedDistrict,
    permanentSelectedUpazila,
    permanentSelectedPostOffice,
  ] = useWatch({
    control: form.control,
    name: [
      "presentDivision",
      "presentDistrict",
      "presentUpazila",
      "presentPostOffice",
      "permanentDivision",
      "permanentDistrict",
      "permanentUpazila",
      "permanentPostOffice",
    ],
  });

  //division
  useEffect(() => {
    const fetchDivisions = async () => {
      const data = await getDivisions();
      setDivisions(data);
    };
    fetchDivisions();
  }, []);

  // present districts
  useEffect(() => {
    const fetchPresentDistricts = async () => {
      if (!presentSelectedDivision) return;
      const data = await getDistrictsByDivision(presentSelectedDivision);
      setPresentDistricts(data);
    };
    fetchPresentDistricts();
  }, [presentSelectedDivision]);

  //present thanas/upazilas
  useEffect(() => {
    const fetchPresentUpazilas = async () => {
      if (!presentSelectedDistrict) return;
      const data = await getUpazilasByDistrict(presentSelectedDistrict);
      setPresentUpazilas(data);
    };
    fetchPresentUpazilas();
  }, [presentSelectedDistrict]);

  //present postOffice
  useEffect(() => {
    const fetchPresentPostOffices = async () => {
      if (!presentSelectedUpazila) return;
      const data = await getPostOfficesByUpazila(presentSelectedUpazila);
      setPresentPostOffices(data);
    };
    fetchPresentPostOffices();
  }, [presentSelectedUpazila]);

  // present postofficecode
  useEffect(() => {
    const fetchPresentPostOfficeCode = async () => {
      if (!presentSelectedPostOffice) return;
      const data = await getPostCodeByPostOffice(presentSelectedPostOffice);
      form.setValue("presentPostCode", data.postCode);
    };
    fetchPresentPostOfficeCode();
  }, [presentSelectedPostOffice]);

  // permanent districts
  useEffect(() => {
    const fetchPermanentDistricts = async () => {
      if (!permanentSelectedDivision) return;
      const data = await getDistrictsByDivision(permanentSelectedDivision);
      setPermanentDistricts(data);
    };
    fetchPermanentDistricts();
  }, [permanentSelectedDivision]);

  //permanent thanas/upazilas
  useEffect(() => {
    const fetchPermanentUpazilas = async () => {
      if (!permanentSelectedDistrict) return;
      const data = await getUpazilasByDistrict(permanentSelectedDistrict);
      setPermanentUpazilas(data);
    };
    fetchPermanentUpazilas();
  }, [permanentSelectedDistrict]);

  //permanent postOffice
  useEffect(() => {
    const fetchPermanentPostOffices = async () => {
      if (!permanentSelectedUpazila) return;
      const data = await getPostOfficesByUpazila(permanentSelectedUpazila);
      setPermanentPostOffices(data);
    };
    fetchPermanentPostOffices();
  }, [permanentSelectedUpazila]);

  // permanent postofficecode
  useEffect(() => {
    const fetchPermanentPostOfficeCode = async () => {
      if (!permanentSelectedPostOffice) return;
      const data = await getPostCodeByPostOffice(permanentSelectedPostOffice);
      form.setValue("permanentPostCode", data.postCode);
    };
    fetchPermanentPostOfficeCode();
  }, [permanentSelectedPostOffice]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Address Information</CardTitle>
        <CardDescription>
          Please provide your present and permanent address details accurately.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <h5>Present Address</h5>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="presentDivision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Division*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full capitalize">
                          <SelectValue placeholder="Select division" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {divisions.map((d) => (
                          <SelectItem
                            key={d.id}
                            value={d.name}
                            className="capitalize"
                          >
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="presentDistrict"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!presentSelectedDivision}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full capitalize">
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {presentDistricts.map((d) => (
                          <SelectItem
                            key={d.id}
                            value={d.name}
                            className="capitalize"
                          >
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="presentUpazila"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upazila/Thana*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!presentSelectedDistrict}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full capitalize">
                          <SelectValue placeholder="Select Upazila/Thana" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {presentUpazilas.map((u) => (
                          <SelectItem
                            key={u.id}
                            value={u.name}
                            className="capitalize"
                          >
                            {u.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="presentPostOffice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post office*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!presentSelectedUpazila}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full capitalize">
                          <SelectValue placeholder="Select post office" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {presentPostOffices.map((p) => (
                          <SelectItem
                            key={p.id}
                            value={p.name}
                            className="capitalize"
                          >
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="presentPostCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Code*</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="presentDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details*</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Road, Area, House..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="my-6 flex items-center gap-2 ">
              <Checkbox
                checked={sameAsPresent}
                onCheckedChange={(val) =>
                  handleSameAsPresentToggle(val as boolean)
                }
              />
              <p>Same as Present Address</p>
            </div>

            {!sameAsPresent && (
              <>
                <h5>Permanent Address</h5>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="permanentDivision"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Division*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full capitalize">
                              <SelectValue placeholder="Select division" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {divisions.map((d) => (
                              <SelectItem
                                key={d.id}
                                value={d.name}
                                className="capitalize"
                              >
                                {d.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentDistrict"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!permanentSelectedDivision}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full capitalize">
                              <SelectValue placeholder="Select district" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {permanentDistricts.map((d) => (
                              <SelectItem
                                key={d.id}
                                value={d.name}
                                className="capitalize"
                              >
                                {d.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentUpazila"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upazila/Thana*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!permanentSelectedDistrict}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full capitalize">
                              <SelectValue placeholder="Select Upazila/Thana" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {permanentUpazilas.map((u) => (
                              <SelectItem
                                key={u.id}
                                value={u.name}
                                className="capitalize"
                              >
                                {u.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanentPostOffice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Post office*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!permanentSelectedUpazila}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full capitalize">
                              <SelectValue placeholder="Select post office" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {permanentPostOffices.map((p) => (
                              <SelectItem
                                key={p.id}
                                value={p.name}
                                className="capitalize"
                              >
                                {p.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="permanentPostCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Post Code*</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="permanentDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Details*</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Road, Area, House..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <ErrorMessage error={error} />
            <div className="flex justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/create-profile/1")}
                disabled={isPending}
              >
                Previous
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
