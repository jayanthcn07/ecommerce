import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AnnouncementBar } from "./AnnouncementBar";
import { ScrollToTop } from "./ScrollToTop";

export const Layout = () => {
  const { pathname } = useLocation();
  // Smooth-scroll to top on route change for a more polished feel.
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [pathname]);
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <AnnouncementBar />
      <Navbar />
      <main key={pathname} className="flex-1 animate-fade-in"><Outlet /></main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};
