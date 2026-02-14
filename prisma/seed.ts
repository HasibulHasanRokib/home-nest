import { db } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";

const users: (Prisma.UserUncheckedCreateInput & {
  profile: Prisma.ProfileUncheckedCreateWithoutUserInput;
  address: Prisma.AddressUncheckedCreateWithoutUserInput;
  declaration: Prisma.DeclarationUncheckedCreateWithoutUserInput;
})[] = [
  {
    name: "Ariful Islam",
    email: "ariful.owner@example.com",
    role: "OWNER",
    status: "NOT_VERIFIED",
    image: "https://i.pravatar.cc/150?u=arif",
    profile: {
      mobileNumber: "01711223344",
      dateOfBirth: new Date("1985-05-12"),
      gender: "MALE",
      religion: "ISLAM",
      occupation: "Businessman",
      nidNumber: "1234567890",
      attachment1: "https://placehold.co/600x400?text=NID_Front",
      attachment2: "https://placehold.co/600x400?text=NID_Back",
      bankAccount: "123.456.789.0",
      mobileBanking: "01711223344",
    },
    address: {
      division: "Dhaka",
      district: "Dhaka",
      upazila: "Gulshan",
      postOffice: "Gulshan",
      postCode: "1212",
      details: "House 12, Road 5, Block A",
    },
    declaration: {
      photo: "https://i.pravatar.cc/150?u=arif",
      signature: "https://placehold.co/200x100?text=Arif_Sign",
    },
  },
  {
    name: "Sultana Razia",
    email: "razia.owner@example.com",
    role: "OWNER",
    status: "NOT_VERIFIED",
    image: "https://i.pravatar.cc/150?u=razia",
    profile: {
      mobileNumber: "01822334455",
      dateOfBirth: new Date("1990-08-20"),
      gender: "FEMALE",
      religion: "ISLAM",
      occupation: "Housewife",
      nidNumber: "9876543210",
      attachment1: "https://placehold.co/600x400?text=NID_Front",
      attachment2: "https://placehold.co/600x400?text=NID_Back",
      mobileBanking: "01822334455",
    },
    address: {
      division: "Dhaka",
      district: "Dhaka",
      upazila: "Uttara",
      postOffice: "Uttara",
      postCode: "1230",
      details: "Sector 4, Road 12, Flat 3B",
    },
    declaration: {
      photo: "https://i.pravatar.cc/150?u=razia",
      signature: "https://placehold.co/200x100?text=Razia_Sign",
    },
  },
  {
    name: "Biplob Kumar",
    email: "biplob.owner@example.com",
    role: "OWNER",
    status: "NOT_VERIFIED",
    profile: {
      mobileNumber: "01933445566",
      dateOfBirth: new Date("1978-01-15"),
      gender: "MALE",
      religion: "HINDUISM",
      occupation: "Government Employee",
      nidNumber: "4567891230",
      attachment1: "https://placehold.co/600x400?text=NID_Front",
      attachment2: "https://placehold.co/600x400?text=NID_Back",
      bankAccount: "DBBL-456-789",
    },
    address: {
      division: "Chattogram",
      district: "Chattogram",
      upazila: "Panchlaish",
      postOffice: "Chawkbazar",
      postCode: "4203",
      details: "Hillview R/A, House 45",
    },
    declaration: {
      photo: "https://i.pravatar.cc/150?u=biplob",
      signature: "https://placehold.co/200x100?text=Biplob_Sign",
    },
  },
  {
    name: "Farhana Ahmed",
    email: "farhana.owner@example.com",
    role: "OWNER",
    status: "NOT_VERIFIED",
    profile: {
      mobileNumber: "01644556677",
      dateOfBirth: new Date("1988-11-30"),
      gender: "FEMALE",
      religion: "ISLAM",
      occupation: "Teacher",
      nidNumber: "3216549870",
      attachment1: "https://placehold.co/600x400?text=NID_Front",
      attachment2: "https://placehold.co/600x400?text=NID_Back",
      mobileBanking: "01644556677",
    },
    address: {
      division: "Sylhet",
      district: "Sylhet",
      upazila: "Sylhet Sadar",
      postOffice: "Sylhet",
      postCode: "3100",
      details: "Zindabazar, Lane 4",
    },
    declaration: {
      photo: "https://i.pravatar.cc/150?u=farhana",
      signature: "https://placehold.co/200x100?text=Farhana_Sign",
    },
  },
  {
    name: "Michael Rozario",
    email: "michael.owner@example.com",
    role: "OWNER",
    status: "NOT_VERIFIED",
    profile: {
      mobileNumber: "01555667788",
      dateOfBirth: new Date("1982-03-22"),
      gender: "MALE",
      religion: "CHRISTIANITY",
      occupation: "Software Engineer",
      nidNumber: "7891234560",
      attachment1: "https://placehold.co/600x400?text=NID_Front",
      attachment2: "https://placehold.co/600x400?text=NID_Back",
      bankAccount: "Standard-112233",
    },
    address: {
      division: "Dhaka",
      district: "Dhaka",
      upazila: "Banani",
      postOffice: "Banani",
      postCode: "1213",
      details: "Block C, Road 11",
    },
    declaration: {
      photo: "https://i.pravatar.cc/150?u=michael",
      signature: "https://placehold.co/200x100?text=Michael_Sign",
    },
  },

  {
    name: "Kamrul Hasan",
    email: "kamrul.tenant@example.com",
    role: "TENANT",
    status: "NOT_VERIFIED",
    profile: {
      mobileNumber: "01311002233",
      dateOfBirth: new Date("1995-12-05"),
      gender: "MALE",
      religion: "ISLAM",
      occupation: "Banker",
      nidNumber: "1122334455",
      attachment1: "https://placehold.co/600x400?text=NID_Front",
      attachment2: "https://placehold.co/600x400?text=NID_Back",
      familySize: 4,
      householdType: "FAMILY",
    },
    address: {
      division: "Dhaka",
      district: "Dhaka",
      upazila: "Mirpur",
      postOffice: "Mirpur",
      postCode: "1216",
      details: "Avenue 5, Block C",
    },
    declaration: {
      photo: "https://i.pravatar.cc/150?u=kamrul",
      signature: "https://placehold.co/200x100?text=Kamrul_Sign",
    },
  },
  {
    name: "Anika Tabassum",
    email: "anika.tenant@example.com",
    role: "TENANT",
    status: "NOT_VERIFIED",
    profile: {
      mobileNumber: "01422003344",
      dateOfBirth: new Date("1998-04-10"),
      gender: "FEMALE",
      religion: "ISLAM",
      occupation: "Medical Student",
      nidNumber: "5544332211",
      attachment1: "https://placehold.co/600x400?text=NID_Front",
      attachment2: "https://placehold.co/600x400?text=NID_Back",
      familySize: 1,
      householdType: "BACHELOR",
    },
    address: {
      division: "Dhaka",
      district: "Dhaka",
      upazila: "Dhanmondi",
      postOffice: "Dhanmondi",
      postCode: "1209",
      details: "Road 15A, Green Road",
    },
    declaration: {
      photo: "https://i.pravatar.cc/150?u=anika",
      signature: "https://placehold.co/200x100?text=Anika_Sign",
    },
  },
  {
    name: "Rahat Chowdhury",
    email: "rahat.tenant@example.com",
    role: "TENANT",
    status: "NOT_VERIFIED",
    profile: {
      mobileNumber: "01755006677",
      dateOfBirth: new Date("1993-09-18"),
      gender: "MALE",
      religion: "ISLAM",
      occupation: "Marketing Manager",
      nidNumber: "7788994455",
      attachment1: "https://placehold.co/600x400?text=NID_Front",
      attachment2: "https://placehold.co/600x400?text=NID_Back",
      familySize: 3,
      householdType: "FAMILY",
    },
    address: {
      division: "Dhaka",
      district: "Dhaka",
      upazila: "Badda",
      postOffice: "Gulshan",
      postCode: "1212",
      details: "North Badda, Lane 2",
    },
    declaration: {
      photo: "https://i.pravatar.cc/150?u=rahat",
      signature: "https://placehold.co/200x100?text=Rahat_Sign",
    },
  },
  {
    name: "Shyamol Das",
    email: "shyamol.tenant@example.com",
    role: "TENANT",
    status: "NOT_VERIFIED",
    profile: {
      mobileNumber: "01866007788",
      dateOfBirth: new Date("1996-06-25"),
      gender: "MALE",
      religion: "HINDUISM",
      occupation: "Graphic Designer",
      nidNumber: "6655447788",
      attachment1: "https://placehold.co/600x400?text=NID_Front",
      attachment2: "https://placehold.co/600x400?text=NID_Back",
      familySize: 1,
      householdType: "BACHELOR",
    },
    address: {
      division: "Khulna",
      district: "Khulna",
      upazila: "Khulna Sadar",
      postOffice: "Khulna",
      postCode: "9100",
      details: "Boyra Main Road",
    },
    declaration: {
      photo: "https://i.pravatar.cc/150?u=shyamol",
      signature: "https://placehold.co/200x100?text=Shyamol_Sign",
    },
  },
  {
    name: "Jannatun Nayeem",
    email: "jannat.tenant@example.com",
    role: "TENANT",
    status: "NOT_VERIFIED",
    profile: {
      mobileNumber: "01977008899",
      dateOfBirth: new Date("2000-01-01"),
      gender: "FEMALE",
      religion: "ISLAM",
      occupation: "Student",
      nidNumber: "2255887744",
      attachment1: "https://placehold.co/600x400?text=NID_Front",
      attachment2: "https://placehold.co/600x400?text=NID_Back",
      familySize: 2,
      householdType: "BACHELOR",
    },
    address: {
      division: "Dhaka",
      district: "Dhaka",
      upazila: "Farmgate",
      postOffice: "Tejgaon",
      postCode: "1215",
      details: "Indira Road, Green Tower",
    },
    declaration: {
      photo: "https://i.pravatar.cc/150?u=jannat",
      signature: "https://placehold.co/200x100?text=Jannat_Sign",
    },
  },
];

const properties: Prisma.PropertyCreateInput[] = [
  {
    title: "Luxury 3BR Apartment in Gulshan 2",
    slug: "luxury-3br-apartment-gulshan-2",
    location: "Gulshan, Dhaka",
    price: 85000,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2200,
    availableFrom: new Date("2026-03-01"),
    description:
      "A premium luxury apartment with a lake view, high-end fittings, and 24/7 security. Perfect for corporate families.",
    leaseTerm: "1 Year",
    amenities: ["Elevator", "Generator", "Parking", "CCTV", "Gym"],
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
    propertyType: "APARTMENT",
    petPolicy: "NOT_ALLOWED",
    status: "AVAILABLE",
    owner: {
      connect: { id: "uuXLsXM2SBst9RhjQPB84Z3sALBamSUr" },
    },
  },
  {
    title: "Cozy Studio Room for Bachelors",
    slug: "cozy-studio-room-bachelors",
    location: "Farmgate, Dhaka",
    price: 12000,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 350,
    availableFrom: new Date("2026-02-20"),
    description:
      "Ideal for students or job holders. Close to the metro station and main road.",
    leaseTerm: "6 Months",
    amenities: ["WiFi", "Water 24/7", "Shared Kitchen"],
    images: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c"],
    propertyType: "ROOM",
    petPolicy: "NOT_ALLOWED",
    status: "AVAILABLE",
    owner: {
      connect: { id: "uuXLsXM2SBst9RhjQPB84Z3sALBamSUr" },
    },
  },
  {
    title: "Modern Duplex House with Garden",
    slug: "modern-duplex-house-garden",
    location: "Purbachal, Dhaka",
    price: 150000,
    bedrooms: 5,
    bathrooms: 4,
    sqft: 4500,
    availableFrom: new Date("2026-04-15"),
    description:
      "Spacious duplex house with a private garden and rooftop terrace. Experience quiet suburban life.",
    leaseTerm: "2 Years",
    amenities: ["Private Garden", "Garage", "Solar Power", "Maid Room"],
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750"],
    propertyType: "HOUSE",
    petPolicy: "ALLOWED",
    status: "PENDING",
    owner: {
      connect: { id: "uuXLsXM2SBst9RhjQPB84Z3sALBamSUr" },
    },
  },
  {
    title: "Affordable 2BR Flat in Mirpur 10",
    slug: "affordable-2br-flat-mirpur-10",
    location: "Mirpur, Dhaka",
    price: 22000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1050,
    availableFrom: new Date("2026-03-01"),
    description:
      "Well-ventilated flat near the metro station. High floor with good natural light.",
    leaseTerm: "1 Year",
    amenities: ["Security", "LPG Gas", "Balcony"],
    images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb"],
    propertyType: "APARTMENT",
    petPolicy: "NOT_ALLOWED",
    status: "AVAILABLE",
    owner: {
      connect: { id: "uuXLsXM2SBst9RhjQPB84Z3sALBamSUr" },
    },
  },
  {
    title: "Premium Sublet Room for Working Women",
    slug: "premium-sublet-room-working-women",
    location: "Dhanmondi, Dhaka",
    price: 15000,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 400,
    availableFrom: new Date("2026-02-28"),
    description:
      "Large room in a family flat. Safety and privacy guaranteed for female professionals.",
    leaseTerm: "Monthly",
    amenities: ["Furnished", "Microwave", "Washing Machine"],
    images: ["https://images.unsplash.com/photo-1505691938895-1758d7eaa511"],
    propertyType: "ROOM",
    petPolicy: "NOT_ALLOWED",
    status: "AVAILABLE",
    owner: {
      connect: { id: "uuXLsXM2SBst9RhjQPB84Z3sALBamSUr" },
    },
  },
  {
    title: "3BR Semi-Furnished Flat in Uttara Sector 4",
    slug: "3br-semi-furnished-flat-uttara",
    location: "Uttara, Dhaka",
    price: 35000,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1600,
    availableFrom: new Date("2026-03-10"),
    description:
      "Recently renovated flat with modern kitchen cabinets and wardrobe. Very close to the airport.",
    leaseTerm: "1 Year",
    amenities: ["Elevator", "Security", "Intercom", "WiFi"],
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"],
    propertyType: "APARTMENT",
    petPolicy: "ALLOWED",
    status: "AVAILABLE",
    owner: {
      connect: { id: "uuXLsXM2SBst9RhjQPB84Z3sALBamSUr" },
    },
  },
  {
    title: "Penthouse with Private Pool",
    slug: "penthouse-private-pool",
    location: "Banani, Dhaka",
    price: 250000,
    bedrooms: 4,
    bathrooms: 5,
    sqft: 5000,
    availableFrom: new Date("2026-05-01"),
    description:
      "Exclusive penthouse featuring a private swimming pool and a stunning 360-degree city view.",
    leaseTerm: "2 Years",
    amenities: ["Pool", "Smart Home System", "4 Car Parking", "Staff Quarter"],
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811"],
    propertyType: "APARTMENT",
    petPolicy: "ALLOWED",
    status: "AVAILABLE",
    owner: {
      connect: { id: "uuXLsXM2SBst9RhjQPB84Z3sALBamSUr" },
    },
  },
  {
    title: "Small Independent House",
    slug: "small-independent-house",
    location: "Badda, Dhaka",
    price: 45000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    availableFrom: new Date("2026-03-05"),
    description:
      "Standalone small house with no shared walls. Great for people who love privacy.",
    leaseTerm: "1 Year",
    amenities: ["Independent Utility", "CCTV", "Open Terrace"],
    images: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233"],
    propertyType: "HOUSE",
    petPolicy: "ALLOWED",
    status: "REJECTED",
    owner: {
      connect: { id: "uuXLsXM2SBst9RhjQPB84Z3sALBamSUr" },
    },
  },
  {
    title: "Master Bed Sublet in Bashundhara R/A",
    slug: "master-bed-sublet-bashundhara",
    location: "Bashundhara R/A, Dhaka",
    price: 18000,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 550,
    availableFrom: new Date("2026-02-15"),
    description:
      "Master bedroom with attached bath and a large balcony in a 3-bedroom flat. Block C.",
    leaseTerm: "6 Months",
    amenities: ["Generator", "WiFi", "Filtered Water"],
    images: ["https://images.unsplash.com/photo-1554995207-c18c203602cb"],
    propertyType: "ROOM",
    petPolicy: "NOT_ALLOWED",
    status: "RENTED",
    owner: {
      connect: { id: "uuXLsXM2SBst9RhjQPB84Z3sALBamSUr" },
    },
  },
  {
    title: "Spacious 4BR Family Flat near Science Lab",
    slug: "spacious-4br-family-flat-science-lab",
    location: "Science Lab, Dhaka",
    price: 55000,
    bedrooms: 4,
    bathrooms: 4,
    sqft: 2800,
    availableFrom: new Date("2026-03-25"),
    description:
      "Traditional large flat for a big family. Walking distance to schools and universities.",
    leaseTerm: "1 Year",
    amenities: ["Gas Connection", "Parking", "Security", "Large Balcony"],
    images: ["https://images.unsplash.com/photo-1484154218962-a197022b5858"],
    propertyType: "APARTMENT",
    petPolicy: "NOT_ALLOWED",
    status: "AVAILABLE",
    owner: {
      connect: { id: "uuXLsXM2SBst9RhjQPB84Z3sALBamSUr" },
    },
  },
];

export async function main() {
  console.log("Starting to seed...");

  for (const u of users) {
    const { profile, address, declaration, ...userData } = u;

    await db.user.create({
      data: {
        ...userData,
        profile: { create: profile },
        address: { create: address },
        declaration: { create: declaration },
      },
    });
  }

  for (const p of properties) {
    await db.property.create({
      data: p,
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
