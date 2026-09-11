"use client";

import { useState } from "react";
import TopBar from "../components/topbar";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: "",
      });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <TopBar />
        <Navbar />

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-emerald-200 border border-white/15 mb-3">
              <Sparkles size={14} className="text-amber-300" />
              <span>We Are Here For You</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Get in Touch with TastyByte
            </h1>
            <p className="mt-2 text-sm text-emerald-100/90 max-w-xl mx-auto">
              Have a question about your order, table reservations, or catering services? Send us a message!
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Contact Information Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Reach out to us directly or visit our flagship restaurant.
                </p>
              </div>

              {/* Info Cards */}
              <div className="space-y-3">
                {/* Address */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-start gap-3.5 hover:border-emerald-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                      Our Location
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                      #128 Preah Norodom Blvd, BKK1, Phnom Penh, Cambodia
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-start gap-3.5 hover:border-emerald-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                      Phone &amp; Hotline
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      +855 23 999 888 / +855 12 345 678
                    </p>
                    <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                      Toll-free 24/7 delivery support
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-start gap-3.5 hover:border-emerald-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                      Email Address
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      support@tastybyte.com
                    </p>
                    <p className="text-xs text-gray-600">
                      orders@tastybyte.com
                    </p>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-start gap-3.5 hover:border-emerald-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                      Opening Hours
                    </h4>
                    <div className="text-xs text-gray-600 mt-0.5 space-y-0.5">
                      <div className="flex justify-between gap-4">
                        <span>Monday – Friday:</span>
                        <span className="font-semibold text-gray-800">8:00 AM – 10:30 PM</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>Saturday – Sunday:</span>
                        <span className="font-semibold text-gray-800">7:30 AM – 11:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick FAQ note */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                <HelpCircle size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Need instant order tracking?</strong> You can also track your food live using our Order Sidebar on the Food page.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: Simple Contact Form (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare size={20} className="text-emerald-600" />
                  <span>Send Us a Message</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Fill out the simple form below and our team will get back to you within 2 hours.
                </p>
              </div>

              {isSuccess && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-fadeIn">
                  <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold">Thank you for reaching out!</p>
                    <p className="text-emerald-700 mt-0.5">
                      Your message has been received. We will contact you shortly.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-gray-800"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-gray-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +855 12 345 678"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-gray-800"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Inquiry Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-gray-800 cursor-pointer"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Food Order & Delivery">Food Order &amp; Delivery</option>
                      <option value="Table Reservation">Table Reservation</option>
                      <option value="Catering & Events">Catering &amp; Events</option>
                      <option value="Feedback & Suggestions">Feedback &amp; Suggestions</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we help you today? Write your question or request here..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-gray-800 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Message...</span>
                    </div>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
