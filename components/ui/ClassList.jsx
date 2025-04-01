"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns"; // 📦 used for date formatting
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ClassList() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");

  const fetchClasses = async () => {
    try {
      const res = await fetch("/api/classes");
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleDelete = async (classCode) => {
    if (confirm("Are you sure?")) {
      await fetch(`/api/classes/${classCode}`, { method: "DELETE" });
      fetchClasses();
    }
  };

  const filteredClasses = classes.filter((cls) =>
    `${cls.classCode} ${cls.className} ${cls.teacherID}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Classes</CardTitle>
          <Link href="/dashboard/classes/add">
            <Button>Add Class</Button>
          </Link>
        </CardHeader>

        <CardContent>
          <div className="my-4">
            <Input
              placeholder="Search classes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Code</TableHead>
                <TableHead>Class Name</TableHead>
                <TableHead>Teacher ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell>{cls.classCode}</TableCell>
                    <TableCell>{cls.className}</TableCell>
                    <TableCell>{cls.teacherID}</TableCell>
                    <TableCell>{cls.status}</TableCell>
                    <TableCell>
                      {cls.date ? format(new Date(cls.date), "yyyy-MM-dd") : "N/A"}
                    </TableCell>
                    <TableCell>
                      {cls.time ? format(new Date(cls.time), "HH:mm") : "N/A"}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/dashboard/classes/edit/${cls.classCode}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(cls.classCode)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No classes found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
