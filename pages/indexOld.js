import { supabase } from '../utils/supabase';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/user';
import Link from 'next/link';

const Index = () => {
  const { user } = useUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>{user?.profile?.email}</h1>
    </main>
  );
};

export const getProduct = async () => {
  const { data } = await supabase.from('products').select('*');
  return data;
};

export default Index;
