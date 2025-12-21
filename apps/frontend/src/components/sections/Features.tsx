'use client';

import { motion } from 'framer-motion';
import { StaggerContainer } from '../animations/StaggerContainer';
import { StaggerItem } from '../animations/StaggerItem';

const features = [
  {
    icon: '🚗',
    title: 'خودروهای متنوع',
    description: 'گسترده‌ترین مجموعه خودروهای جدید و کارکرده',
  },
  {
    icon: '✅',
    title: 'تضمین کیفیت',
    description: 'تمام خودروها با گارانتی و تضمین کیفیت',
  },
  {
    icon: '🔧',
    title: 'خدمات پس از فروش',
    description: 'پشتیبانی کامل و خدمات حرفه‌ای',
  },
  {
    icon: '💰',
    title: 'قیمت مناسب',
    description: 'بهترین قیمت‌ها در بازار',
  },
  {
    icon: '⚡',
    title: 'تحویل سریع',
    description: 'تحویل در کمترین زمان ممکن',
  },
  {
    icon: '🛡️',
    title: 'امنیت کامل',
    description: 'خرید و فروش امن و مطمئن',
  },
];

export function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            چرا فیدار تجارت سوبا؟
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ما بهترین خدمات را برای شما ارائه می‌دهیم
          </p>
        </motion.div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
