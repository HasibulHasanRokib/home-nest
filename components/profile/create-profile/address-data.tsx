"use server";

type Division = { id: string; name: string };
type District = { id: string; name: string };
type Upazila = { id: string; name: string };
type PostOffice = { id: string; name: string; postCode: string };

export async function getDivisions() {
  const resp = await fetch("https://thikanabd.vercel.app/api/divisions");
  if (!resp.ok) return [];
  const data = await resp.json();
  return data.sort((a: Division, b: Division) => a.name.localeCompare(b.name));
}

export async function getDistricts() {
  const resp = await fetch("https://thikanabd.vercel.app/api/districts");
  if (!resp.ok) return [];
  const data = await resp.json();
  return data.sort((a: District, b: District) => a.name.localeCompare(b.name));
}

export async function getDistrictsByDivision(division: string) {
  const resp = await fetch(
    `https://thikanabd.vercel.app/api/divisions/${division}`
  );
  if (!resp.ok) return [];
  const data = await resp.json();
  return data.sort((a: District, b: District) => a.name.localeCompare(b.name));
}

export async function getUpazilasByDistrict(district: string) {
  const resp = await fetch(
    `https://thikanabd.vercel.app/api/districts/${district}`
  );
  if (!resp.ok) return [];
  const data = await resp.json();
  return data.sort((a: Upazila, b: Upazila) => a.name.localeCompare(b.name));
}

export async function getPostOfficesByUpazila(upazila: string) {
  const resp = await fetch(
    `https://thikanabd.vercel.app/api/upazillas/${upazila}`
  );
  if (!resp.ok) return [];
  const data = await resp.json();
  return data.sort((a: PostOffice, b: PostOffice) =>
    a.name.localeCompare(b.name)
  );
}

export async function getPostCodeByPostOffice(postoffice: string) {
  const resp = await fetch(
    `https://thikanabd.vercel.app/api/postoffices/${postoffice}`
  );
  if (!resp.ok) return [];
  const data = await resp.json();
  return data;
}
