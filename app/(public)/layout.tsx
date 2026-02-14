import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <main>
      <Navbar />
      <section>{children}</section>
      <Footer />
    </main>
  );
}
