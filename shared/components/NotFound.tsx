export default function NotFound() {
  return (
    <div data-testid="container" className="my-4 md:my-6 mx-auto h-full" role={NotFound.role}>
      <div className="mx-2 xl:max-w-[90%] xl:mx-auto h-full flex items-center justify-center">
        <h3 className="font-semibold text-4xl">404 - Not Found</h3>
      </div>
    </div>
  );
}

NotFound.role = 'not-found-component';
