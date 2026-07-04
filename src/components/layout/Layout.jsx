import { useEffect } from 'react';
import NavAmazon from '../navbar/NavAmazon';
import BottomNav from '../navbar/BottomNav';
import Footer from '../footer/Footer';
import { Outlet, useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function Layout() {
  return (
    <>
      <ScrollToTop />
      <NavAmazon />
      {/* pb-[60px] ensures content isn't hidden behind the bottom nav on mobile */}
      <main className="lg:pb-0 pb-[60px]">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}

export default Layout;
