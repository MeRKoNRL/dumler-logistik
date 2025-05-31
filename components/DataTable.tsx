'use client';
import React from 'react';

interface Props {
  columns: string[];
  data: Record<string, any>[];
  className?: string;
}

export default function DataTable({ columns, data, className = '' }: Props) {
  return (
    <div className="overflow-x-auto responsive-table">
      <table className={\`table-auto w-full text-sm border \${className}\`}>
        <thead className="bg-gray-100">
          <tr>
            {columns.map(col => (
              <th key={col} className="border px-2 py-1 text-left">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={col} className="border px-2 py-1">
                  {row[col] ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
