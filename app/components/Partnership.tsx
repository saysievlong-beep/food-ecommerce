"use client";

import { useEffect, useRef, useState } from "react";

export interface PartnerCompany {
    id: string;
    name: string;
    logoUrl: string;
    description: string;
}

const PARTNER_LOGOS: PartnerCompany[] = [
    {
        id: "1",
        name: "GrabExpress",
        logoUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD45PkfCmkti4sCtEVhQjuW432OEY4WCNaQpNk5sp-ynmko2JPAoxbQ9Y&s=10",
        description: "Ultra-fast direct point-to-point courier delivery for hot and fresh meals.",
    },
    {
        id: "2",
        name: "DoorDash",
        logoUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3-YTP6A0sLFvU29fGeQzUll3Yj1U-EOv2WLAVa8VVuQ&s=10",
        description: "On-demand food delivery connecting local restaurants with customers.",
    },
    {
        id: "3",
        name: "Uber Eats",
        logoUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY51DEfYRGN_M8dEJw2cec4QrkYqSnZ7ulqzZiAafkjg&s=10",
        description: "Global delivery network with fast dispatch and live order tracking.",
    },
    {
        id: "4",
        name: "Deliveroo",
        logoUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNW1X2RspMBwydfidqHfcNatszIY-70STksz7JF5FaP93g4FnGZLQ_Om0&s=10",
        description: "Eco-friendly couriers ensuring rapid neighborhood meal drop-offs.",
    },
    {
        id: "5",
        name: "Foodpanda",
        logoUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW03cLdHItpSnk5vz5m8i7UkV6forwfzfiZQhsoTci6w&s=10",
        description: "Convenient express food delivery straight to your doorstep.",
    },
    {
        id: "6",
        name: "DHL Express",
        logoUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKeQ4FcNqZgh7-xyTkkhK1uwBpqp17-7M3XafS3UJgKw&s=10",
        description: "Reliable climate-controlled logistics for bulk and special catering.",
    },
];

export default function Partnership() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            {
                threshold: 0.15,
                rootMargin: "0px 0px -50px 0px",
            }
        );

        const currentEl = sectionRef.current;
        if (currentEl) {
            observer.observe(currentEl);
        }

        return () => {
            if (currentEl) {
                observer.unobserve(currentEl);
            }
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="bg-white py-14 border-b-[5px] border-gray-300 overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with Smooth Fade Up */}
                <div
                    className={`text-center mb-10 transition-all duration-700 ease-out ${
                        isVisible
                            ? "opacity-100 translate-y-0 scale-100"
                            : "opacity-0 translate-y-6 scale-95"
                    }`}
                >
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
                        Our Delivery Partners
                    </p>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                        In Partnership With
                    </h2>
                </div>

                {/* Staggered Pop-In Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {PARTNER_LOGOS.map((partner, index) => (
                        <div
                            key={partner.id}
                            style={{
                                transitionDelay: `${isVisible ? index * 90 : 0}ms`,
                                transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                            }}
                            className={`w-full flex flex-col items-center justify-between rounded-2xl bg-slate-50/80 p-5 text-center border border-gray-100 shadow-xs transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:bg-white hover:border-emerald-200 hover:shadow-lg active:scale-95 cursor-pointer ${
                                isVisible
                                    ? "opacity-100 translate-y-0 scale-100"
                                    : "opacity-0 translate-y-10 scale-75"
                            }`}
                        >
                            {/* Logo */}
                            <div className="w-full flex h-16 items-center justify-center">
                                <img
                                    src={partner.logoUrl}
                                    alt={partner.name}
                                    className="max-h-20 max-w-[200px] object-contain transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>

                            {/* Text Describe */}
                            <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                                {partner.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
