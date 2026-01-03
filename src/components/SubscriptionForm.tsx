'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email('Неверный email'),
  phone: z.string().optional(),
  telegram: z.string().optional(),
  otherContact: z.string().optional(),
  preferredContact: z.enum(['email', 'phone', 'telegram', 'other']).optional(),
  monthlyPrice: z.enum(['free', '5', '10', '15']).optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function SubscriptionForm() {
  console.log('SubscriptionForm component rendered');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    console.log('onSubmit called with data:', data);
    setIsSubmitting(true);
    setError('');

    try {
      console.log('Sending request to /api/submit-lead');
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        console.log('Success! Setting success state');
        setIsSuccess(true);
        reset();
      } else {
        const errorData = await response.json();
        console.log('Error response:', errorData);
        setError(errorData.error || 'Произошла ошибка');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Произошла ошибка при отправке');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section id="subscription-form" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Спасибо за заявку!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Мы свяжемся с вами в ближайшее время.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="subscription-form" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Оформи предзаказ первым
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Получи первый месяц использования бесплатно и будь среди первых пользователей Avoita.
          </p>
        </motion.div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Имя (опционально)
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Ваше имя"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Телефон (опционально)
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telegram username (опционально)
              </label>
              <input
                {...register('telegram')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="@username"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Другой способ связи (опционально)
            </label>
            <input
              {...register('otherContact')}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="WhatsApp, Viber и т.д."
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Предпочитаемый метод связи
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: 'email', label: 'Email' },
                { value: 'phone', label: 'Телефон' },
                { value: 'telegram', label: 'Telegram' },
                { value: 'other', label: 'Другой' },
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    {...register('preferredContact')}
                    type="radio"
                    value={option.value}
                    className="mr-2"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Сумма, которую готовы платить ежемесячно после бесплатного месяца
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: 'free', label: 'Бесплатно' },
                { value: '5', label: '5 евро' },
                { value: '10', label: '10 евро' },
                { value: '15', label: '15 евро' },
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    {...register('monthlyPrice')}
                    type="radio"
                    value={option.value}
                    className="mr-2"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Какие задачи хотите делегировать? (опционально)
            </label>
            <textarea
              {...register('message')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Опишите типичные задачи, которые вы хотели бы автоматизировать..."
            />
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
          </button>
        </form>
      </div>
    </section>
  );
}
