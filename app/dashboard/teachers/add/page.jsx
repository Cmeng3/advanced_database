"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddTeacher() {
  const router = useRouter();
  const [form, setForm] = useState({
    teacherCode: "",
    firstName: "",
    lastName: "",
    subject: "",
    experienceYears: "",
    status: "INSERT",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/dashboard/teachers");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      {["teacherCode", "firstName", "lastName", "subject", "experienceYears"].map((field) => (
        <Input
          key={field}
          name={field}
          placeholder={field}
          value={form[field]}
          onChange={handleChange}
        />
      ))}
      <Button type="submit">Add Teacher</Button>
    </form>
  );
}
