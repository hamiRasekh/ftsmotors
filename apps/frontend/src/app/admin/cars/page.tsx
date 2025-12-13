'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/utils';

export default function AdminCarsPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cars?limit=100`);
      const data = await response.json();
      setCars(data.data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید؟')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/cars/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCars();
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">مدیریت خودروها</h1>
          <p className="text-muted-foreground">مدیریت خودروهای موجود در سیستم</p>
        </div>
        <Link
          href="/admin/cars/new"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-lg"
        >
          ➕ افزودن خودرو
        </Link>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-12 border rounded-xl bg-card">
          <p className="text-muted-foreground mb-4">خودرویی وجود ندارد</p>
          <Link
            href="/admin/cars/new"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            افزودن اولین خودرو
          </Link>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-right">برند</th>
              <th className="px-4 py-3 text-right">مدل</th>
              <th className="px-4 py-3 text-right">دسته‌بندی</th>
              <th className="px-4 py-3 text-right">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id} className="border-t">
                <td className="px-4 py-3">{car.brand}</td>
                <td className="px-4 py-3">{car.model}</td>
                <td className="px-4 py-3">{car.category?.name}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/cars/${car.id}`}
                      className="px-3 py-1 bg-secondary rounded hover:bg-secondary/90"
                    >
                      ویرایش
                    </Link>
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="px-3 py-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}

