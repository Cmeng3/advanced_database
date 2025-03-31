"use client";

import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import Footer from "@/components/ui/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";

export default function AddClassPage() {
  const [date, setDate] = useState(new Date());
  const [form, setForm] = useState({
    classCode: "",
    className: "",
    teacherID: "",
    room: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const schedule = date.toISOString(); // ISO format
    const res = await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, schedule }),
    });

    if (res.ok) {
      router.push("/dashboard/classes");
    } else {
      alert("Failed to add class");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 bg-gray-100">
          <h1 className="text-2xl font-bold mb-6">Add Class</h1>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
            <Input name="classCode" placeholder="Class Code" value={form.classCode} onChange={handleChange} />
            <Input name="className" placeholder="Class Name" value={form.className} onChange={handleChange} />
            <Input name="teacherID" placeholder="Teacher ID" value={form.teacherID} onChange={handleChange} />
            <Input name="room" placeholder="Room" value={form.room} onChange={handleChange} />

            <div>
              <label className="block text-sm font-medium mb-2">Schedule</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>

            <Button type="submit">Save Class</Button>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
}
