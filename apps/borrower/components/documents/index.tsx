import DocumentUploadForm from "./document_upload_form";

export default function DocumentIndex() {

  return (
    <div
      data-testid="container"
      className="my-4 md:my-6 mx-auto h-full"
      role={DocumentIndex.role}
    >
      <div className="mx-2 xl:max-w-[90%] xl:mx-auto h-full">
        <p className="text-2xl md:text-4xl font-bold text-primary capitalize">Documents</p>
        <DocumentUploadForm />
      </div>
    </div>
  );
}

DocumentIndex.role = 'documents-page';
