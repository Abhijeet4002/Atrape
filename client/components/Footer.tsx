export default function Footer() {
  return (
    <footer className="border-t bg-white/50 dark:bg-background/50">
      <div className="container py-8 text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} NovaMart. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a className="hover:text-foreground" href="#">Privacy</a>
          <a className="hover:text-foreground" href="#">Terms</a>
          <a className="hover:text-foreground" href="#">Support</a>
        </div>
      </div>
    </footer>
  );
}
