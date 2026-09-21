"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Dr. A. Sharma",
    role: "Chief Pathologist",
    img: "/team/dr-sharma.png",
    email: "doctor1@example.com",
    phone: "+911111111111",
    slug: "dr-sharma",
    bio: "Dr. Sharma has over 20 years of experience in pathology and diagnostic research.",
  },
  {
    name: "Dr. P. Singh",
    role: "Lab Director",
    img: "/team/dr-p-singh.png",
    email: "doctor2@example.com",
    phone: "+912222222222",
    slug: "dr-singh",
    bio: "Dr. Singh leads the laboratory operations with expertise in modern diagnostics.",
  },
  {
    name: "Nurse R. Kaur",
    role: "Lab Technician",
    img: "/team/nurse-kaur.jpg",
    email: "technician@example.com",
    phone: "+913333333333",
    slug: "nurse-kaur",
    bio: "R. Kaur ensures accurate sample handling and testing processes.",
  },
  {
    name: "Mr. V. Mehta",
    role: "Patient Care Executive",
    img: "/team/mr-mehta.jpg",
    email: "staff@example.com",
    phone: "+914444444444",
    slug: "mr-mehta",
    bio: "Mr. Mehta assists patients with appointments and customer support.",
  },
];

export default function TeamMemberPage() {
  const { slug } = useParams();
  const member = teamMembers.find((m) => m.slug === slug);

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">Member not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-20 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10 text-center">
        <motion.img
          src={member.img}
          alt={member.name}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-32 h-32 rounded-full mx-auto border-4 border-blue-500 shadow-md"
        />

        <h1 className="mt-6 text-3xl font-bold text-gray-800">{member.name}</h1>
        <p className="text-blue-600 font-medium">{member.role}</p>

        <p className="mt-4 text-gray-600">{member.bio}</p>

        <div className="mt-6 space-y-2">
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {member.email}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Phone:</span> {member.phone}
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}