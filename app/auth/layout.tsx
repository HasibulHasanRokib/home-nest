export default function Layout({ children }: LayoutProps<"/auth">) {
  return (
    <main className="min-h-screen flex justify-center items-center p-4">
      {children}
    </main>
  );
}
