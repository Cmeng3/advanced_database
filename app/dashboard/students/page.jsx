import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import StudentList from "@/components/ui/StudentList";
import Footer from "@/components/ui/Footer";

export default function StudentsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-gray-100 overflow-auto">
          <StudentList />
        </main>
      </div>
      <Footer />
    </div>
  );
}
