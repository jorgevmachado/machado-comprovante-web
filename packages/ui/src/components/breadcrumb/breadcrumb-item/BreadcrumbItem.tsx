export type TBreadcrumbItem = {
  href: string;
  label: string;
  clickable: boolean;
  isCurrent: boolean;
  onItemClick: (href: string) => void;
}

export default function BreadcrumbItem({ href, label, clickable, isCurrent, onItemClick }: TBreadcrumbItem) {
  if(isCurrent) {
    return (
      <p className="text-sm text-slate-700 font-semibold" aria-current='page'>
        {label}
      </p>
    );
  }

  if(!clickable) {
    return (
      <p className="text-sm text-slate-400 font-normal" aria-current='page'>
        {label}
      </p>
    );
  }

  return (
    <button
      type="button"
      className="cursor-pointer text-sm font-medium text-slate-400 transition hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      onClick={() => onItemClick(href)}
    >
      {label}
    </button>
  )
}