"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import Footer from "@/components/ui/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

export default function AddClassPage() {
  const router = useRouter();

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("08:00");

  const [form, setForm] = useState({
    classCode: "",
    className: "",
    teacherID: "",
    room: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a valid time string (e.g., 08:00) to store separately
    const [hours, minutes] = time.split(":");
    const timeObj = new Date();
    timeObj.setHours(parseInt(hours));
    timeObj.setMinutes(parseInt(minutes));
    timeObj.setSeconds(0);

    const res = await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        teacherID: parseInt(form.teacherID),
        date: date.toISOString().split("T")[0],        // only YYYY-MM-DD
        time: timeObj.toISOString(),                   // send full ISO time
      }),
    });

    if (res.ok) {
      router.push("/dashboard/classes");
    } else {
      const errorData = await res.json();
      console.error("❌ Failed to add class:", errorData);
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
            <Input
              name="classCode"
              placeholder="Class Code"
              value={form.classCode}
              onChange={handleChange}
            />
            <Input
              name="className"
              placeholder="Class Name"
              value={form.className}
              onChange={handleChange}
            />
            <Input
              name="teacherID"
              placeholder="Teacher ID"
              value={form.teacherID}
              onChange={handleChange}
            />
            <Input
              name="room"
              placeholder="Room"
              value={form.room}
              onChange={handleChange}
            />

            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium mb-2">Class Date</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>

            {/* Time Picker */}
            <div>
              <label className="block text-sm font-medium mb-2">Class Time</label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
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
