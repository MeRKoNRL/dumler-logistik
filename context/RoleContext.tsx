'use client';
import { createContext, useContext } from 'react';

export const RoleContext = createContext<{ role: string | null }>({ role: null });

export const useRole = () => useContext(RoleContext);
