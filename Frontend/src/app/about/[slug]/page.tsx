"use client";

import { useParams } from "next/navigation";
import { teamMembers } from "@/lib/teamData";
import { motion } from "framer-motion";
import Link from "next/link";
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export default function TeamMemberPage() {
  const { slug } = useParams();
  const member = teamMembers.find((m) => m.slug === slug);

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Team member not found ❌
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-20 px-6">
      <div className="container mx-auto max-w-3xl bg-white rounded-2xl shadow-lg p-10 text-center">
        <motion.img
          src={member.img}
          alt={member.name}
          className="w-40 h-40 mx-auto rounded-full border-4 border-blue-500 shadow-md mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.h1
          className="text-3xl font-bold text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {member.name}
        </motion.h1>
        <p className="text-blue-600 mt-2 text-lg font-medium">{member.role}</p>

        {/* Bio / Description (optional, you can add field in teamData.ts) */}
        <p className="mt-4 text-gray-600 leading-relaxed">
          {member.bio ??
            "This team member is a valued part of our lab, ensuring accuracy and care in every process."}
        </p>

        {/* Contact + Appointment Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <a
            href={`tel:${member.phone}`}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <PhoneIcon className="w-5 h-5" /> Call
          </a>
          <a
            href={`mailto:${member.email}`}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
          >
            <EnvelopeIcon className="w-5 h-5" /> Email
          </a>
          <Link
            href="/book-test"
            className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-lg shadow hover:bg-purple-700 transition"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}