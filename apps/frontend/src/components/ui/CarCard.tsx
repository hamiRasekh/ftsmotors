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
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300"
    >
      <Link href={`/cars/${car.category.slug}/${car.slug}`}>
        {car.images && car.images.length > 0 && (
          <div className="aspect-video relative overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={car.images[0]}
                alt={car.brand + ' ' + car.model}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </motion.div>
          </div>
        )}
        <div className="p-6">
          <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
            {car.brand} {car.model}
          </h3>
          <p className="text-gray-600 mb-4 text-sm">{car.category.name}</p>
          {car.description && (
            <p className="text-gray-500 line-clamp-2 text-sm mb-4">{car.description}</p>
          )}
          <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
            بیشتر بدانید
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
