import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import TeacherList from "@/components/ui/TeacherList";
import Footer from "@/components/ui/Footer";

export default function TeachersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-gray-100 overflow-auto">
          <TeacherList />
        </main>
      </div>
      <Footer />
    </div>
  );
}
