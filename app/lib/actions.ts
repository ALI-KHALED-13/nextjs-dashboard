'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createInvoice(formData: FormData) {
  const rawFormData = {
    customerId: formData.get('customerId') as string,
    amount: formData.get('amount') as string,
    status: formData.get('status') as string,
  };
  let amount = parseFloat(rawFormData.amount);
  if (isNaN(amount)){
    throw new Error('amount must be a valid number')
  }
  if (!['pending', 'paid'].includes(rawFormData.status)){
    throw new Error('invalid status')
  }
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${rawFormData.customerId}, ${amountInCents}, ${rawFormData.status}, ${date})
  `;
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices')
}


export async function updateInvoice(id: string, formData: FormData) {
  const rawFormData = {
    customerId: formData.get('customerId') as string,
    amount: formData.get('amount') as string,
    status: formData.get('status') as string,
  };
  let amount = parseFloat(rawFormData.amount);
  if (isNaN(amount)){
    throw new Error('amount must be a valid number')
  }
  if (!['pending', 'paid'].includes(rawFormData.status)){
    throw new Error('invalid status')
  }
  const amountInCents = amount * 100;
 
  await sql`
    UPDATE invoices
    SET customer_id = ${rawFormData.customerId}, amount = ${amountInCents}, status = ${rawFormData.status}
    WHERE id = ${id}
  `;
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}
