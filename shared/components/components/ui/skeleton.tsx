function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-secondary-blue ${className}`}
      {...props}
    />
  );
}

export { Skeleton };
