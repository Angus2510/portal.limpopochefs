import { redirect } from 'next/navigation';
export default async function Student() {
        redirect('auth/signin');
  }
  