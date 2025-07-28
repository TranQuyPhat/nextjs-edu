"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SelectRolePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSelectRole = async (role: "student" | "teacher") => {
    await fetch("/api/auth/set-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    router.push(`/dashboard/${role}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
        <h2 className="text-2xl font-semibold mb-8 text-green-800">
          Bạn là ai ?
        </h2>
        <div className="flex gap-6 justify-center">
          <button
            onClick={() => handleSelectRole("student")}
            className="px-6 py-3 bg-green-700 text-white rounded-md shadow-md hover:bg-green-800 transition"
          >
            Student
          </button>
          <button
            onClick={() => handleSelectRole("teacher")}
            className="px-6 py-3 bg-green-700 text-white rounded-md shadow-md hover:bg-green-800 transition"
          >
            Teacher
          </button>
        </div>
      </div>
    </div>
  );
}
