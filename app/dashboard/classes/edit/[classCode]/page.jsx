"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import Footer from "@/components/ui/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditClassPage() {
  const router = useRouter();
  const { classCode } = useParams();

  const [form, setForm] = useState({
    classCode: "",
    className: "",
    teacherID: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await fetch(`/api/classes`);
        const allClasses = await res.json();
        const found = allClasses.find(cls => cls.classCode === classCode);
        if (found) {
          setForm({
            classCode: found.classCode,
            className: found.className,
            teacherID: found.teacherID,
            date: found.date?.slice(0, 10) || "",
            time: found.time ? new Date(found.time).toISOString().slice(11, 16) : "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch class:", err);
      }
    };
    fetchClass();
  }, [classCode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/classes/${classCode}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          teacherID: parseInt(form.teacherID),
        }),
      });

      if (res.ok) {
        router.push("/dashboard/classes");
      } else {
        alert("Failed to update class");
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 bg-gray-100">
          <h1 className="text-2xl font-bold mb-6">Edit Class</h1>
          <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow space-y-4">
            <Input name="classCode" value={form.classCode} onChange={handleChange} placeholder="Class Code" />
            <Input name="className" value={form.className} onChange={handleChange} placeholder="Class Name" />
            <Input name="teacherID" value={form.teacherID} onChange={handleChange} placeholder="Teacher ID" />
            <Input name="date" type="date" value={form.date} onChange={handleChange} />
            <Input name="time" type="time" value={form.time} onChange={handleChange} />
            <Button type="submit">Update Class</Button>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
}
