"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddStudent() {
  const router = useRouter();
  const [form, setForm] = useState({
    studentCode: "",
    firstName: "",
    lastName: "",
    sex: "",
    status: "INSERT",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/dashboard/students");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      {["studentCode", "firstName", "lastName", "sex"].map((field) => (
        <Input
          key={field}
          name={field}
          placeholder={field}
          value={form[field]}
          onChange={handleChange}
        />
      ))}
      <Button type="submit">Add Student</Button>
    </form>
  );
}
