'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface CarCardProps {
  car: {
    id: string;
    brand: string;
    model: string;
    slug: string;
    description?: string;
    images?: string[];
    category: {
      name: string;
      slug: string;
    };
  };
  index?: number;
}

export function CarCard({ car, index = 0 }: CarCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -15, scale: 1.02 }}
      className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <Link href={`/cars/${car.category.slug}/${car.slug}`}>
        {car.images && car.images.length > 0 && (
          <div className="aspect-video relative overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={car.images[0]}
                alt={car.brand + ' ' + car.model}
                fill
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        <div className="p-6">
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {car.brand} {car.model}
            </h3>
            <p className="text-gray-600 mb-4">{car.category.name}</p>
            {car.description && (
              <p className="text-gray-500 line-clamp-2 text-sm">{car.description}</p>
            )}
            <motion.span
              className="inline-flex items-center gap-2 text-blue-600 font-semibold mt-4"
              whileHover={{ gap: 8 }}
            >
              بیشتر بدانید
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.span>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

