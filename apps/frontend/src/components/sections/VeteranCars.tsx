'use client';

import { FadeIn } from '../animations/FadeIn';

interface VeteranCar {
  name: string;
  category: string;
}

const veteranCars: Record<string, VeteranCar[]> = {
  'جانبازان ۵۰ درصد': [
    { name: 'ب ام و x1', category: 'جانبازان ۵۰ درصد' },
    { name: 'راوفور', category: 'جانبازان ۵۰ درصد' },
    { name: 'ونزا لاکچری', category: 'جانبازان ۵۰ درصد' },
    { name: 'ونزا پریمیوم', category: 'جانبازان ۵۰ درصد' },
    { name: 'وایلندر لاکچری پلاس', category: 'جانبازان ۵۰ درصد' },
    { name: 'ب ام و ۲۲۵l', category: 'جانبازان ۵۰ درصد' },
    { name: 'تویوتا کمری هیبرید xle', category: 'جانبازان ۵۰ درصد' },
  ],
  'جانبازان ۷۰ درصد': [
    { name: 'ب ام و x2', category: 'جانبازان ۷۰ درصد' },
  ],
  'جانبازان ۷۰ ویژه': [
    { name: 'مرسدس بنز c200l', category: 'جانبازان ۷۰ ویژه' },
    { name: 'تویوتا هایلندر', category: 'جانبازان ۷۰ ویژه' },
    { name: 'ب ام و ۳۲۵', category: 'جانبازان ۷۰ ویژه' },
  ],
};

export function VeteranCars() {
  return (
    <section className="py-20 bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              خودروهای جانبازان
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              مجموعه‌ای از بهترین خودروهای موجود برای جانبازان عزیز
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(veteranCars).map(([category, cars], categoryIndex) => (
            <FadeIn key={category} delay={categoryIndex * 0.1}>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-2xl font-bold text-primary mb-6 pb-4 border-b border-gray-200">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {cars.map((car, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors"
                    >
                      <span className="w-2 h-2 bg-secondary rounded-full flex-shrink-0"></span>
                      <span className="text-lg">{car.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              برای اطلاعات بیشتر و مشاوره رایگان با ما تماس بگیرید
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg"
            >
              تماس با ما
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

