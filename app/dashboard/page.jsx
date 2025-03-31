import Navbar from '@/components/ui/Navbar';
import Sidebar from '@/components/ui/Sidebar';
import DashboardContent from '@/components/ui/DashboardContent';
import Footer from '@/components/ui/Footer';

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-gray-100 overflow-auto">
          <DashboardContent />
        </main>
      </div>
      <Footer />
    </div>
  );
}
