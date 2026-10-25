import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const CATEGORIES = [
  'Sedan',
  'SUV',
  'Hatchback',
  'Coupe',
  'Convertible',
  'Truck',
  'Van',
  'Electric',
];

export const VehicleForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
  serverError = '',
}) => {
  const isEditMode = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    make: initialData?.make || '',
    model: initialData?.model || '',
    category: initialData?.category || 'Sedan',
    price: initialData?.price !== undefined ? String(initialData.price) : '',
    quantity: initialData?.quantity !== undefined ? String(initialData.quantity) : '0',
    year: initialData?.year !== undefined ? String(initialData.year) : String(new Date().getFullYear()),
    imageUrl: initialData?.imageUrl || '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.make.trim()) {
      newErrors.make = 'Make is required';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.price === '' || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = 'Price is required and must be greater than or equal to 0';
    }

    if (
      formData.quantity === '' ||
      !Number.isInteger(Number(formData.quantity)) ||
      Number(formData.quantity) < 0
    ) {
      newErrors.quantity = 'Quantity must be an integer greater than or equal to 0';
    }

    if (formData.year && (isNaN(Number(formData.year)) || Number(formData.year) < 1900)) {
      newErrors.year = 'Year must be a valid calendar year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      make: formData.make.trim(),
      model: formData.model.trim(),
      category: formData.category,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      ...(formData.year ? { year: Number(formData.year) } : {}),
      imageUrl: formData.imageUrl.trim(),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {serverError && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"
        >
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Make"
          id="make"
          name="make"
          required
          placeholder="e.g. BMW, Mercedes, Porsche"
          value={formData.make}
          error={errors.make}
          onChange={handleChange}
        />

        <Input
          label="Model"
          id="model"
          name="model"
          required
          placeholder="e.g. M3, E-Class, Taycan"
          value={formData.model}
          error={errors.model}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition-colors"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs font-medium text-rose-600 mt-1">{errors.category}</p>
          )}
        </div>

        <Input
          label="Price (₹)"
          id="price"
          name="price"
          type="number"
          required
          placeholder="e.g. 5000000"
          value={formData.price}
          error={errors.price}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Quantity in Stock"
          id="quantity"
          name="quantity"
          type="number"
          placeholder="0"
          value={formData.quantity}
          error={errors.quantity}
          onChange={handleChange}
        />

        <Input
          label="Model Year"
          id="year"
          name="year"
          type="number"
          placeholder="2024"
          value={formData.year}
          error={errors.year}
          onChange={handleChange}
        />
      </div>

      <Input
        label="Image URL (Optional)"
        id="imageUrl"
        name="imageUrl"
        type="url"
        placeholder="https://images.unsplash.com/..."
        helperText="Leave empty to use high-resolution automotive default placeholder"
        value={formData.imageUrl}
        error={errors.imageUrl}
        onChange={handleChange}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="outline" size="md" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
          {isEditMode ? 'Update Vehicle' : 'Save Vehicle'}
        </Button>
      </div>
    </form>
  );
};
