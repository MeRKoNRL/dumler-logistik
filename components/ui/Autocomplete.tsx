'use client';
import { useState } from 'react';

export function AutocompleteInput({ name, value, onChange, options }: {
  name: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}) {
  const [listId] = useState(() => name + '-list');

  return (
    <>
      <input
        className="border px-2 py-1 w-full text-sm"
        list={listId}
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <datalist id={listId}>
        {options.map((opt, i) => (
          <option key={i} value={opt} />
        ))}
      </datalist>
    </>
  );
}
