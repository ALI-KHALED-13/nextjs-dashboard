'use client';
import { useDebouncedCallback } from 'use-debounce';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';


export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((evt: React.ChangeEvent<HTMLInputElement>)=> {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (evt.target.value.length){
      params.set('query', evt.target.value)
    } else {
      params.delete('query')
    }
    replace(`${pathname}?${params.toString()}`)
  })

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={handleSearch}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
