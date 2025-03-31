"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditClass() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetch(`/api/classes`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(c => c.classCode === params.classCode);
        setForm(found);
      });
  }, [params.classCode]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`/api/classes/${params.classCode}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/dashboard/classes");
  };

  if (!form) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      {["className", "teacherID", "status"].map((field) => (
        <Input
          key={field}
          name={field}
          value={form[field]}
          onChange={handleChange}
        />
      ))}
      <Button type="submit">Update Class</Button>
    </form>
  );
}
