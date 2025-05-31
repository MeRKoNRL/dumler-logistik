'use client';
import React from 'react';

interface Props {
  title: string;
  value: string | number;
  description?: string;
}

export default function InfoCard({ title, value, description }: Props) {
  return (
    <div className="border rounded p-4 shadow-sm text-sm w-full sm:w-auto">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </div>
  );
}
