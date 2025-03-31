"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditTeacher() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetch(`/api/teachers`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(t => t.teacherCode === params.teacherCode);
        setForm(found);
      });
  }, [params.teacherCode]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`/api/teachers/${params.teacherCode}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/dashboard/teachers");
  };

  if (!form) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      {["firstName", "lastName", "subject", "experienceYears", "status"].map((field) => (
        <Input
          key={field}
          name={field}
          value={form[field]}
          onChange={handleChange}
        />
      ))}
      <Button type="submit">Update Teacher</Button>
    </form>
  );
}
