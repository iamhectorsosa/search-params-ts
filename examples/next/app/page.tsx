import { Suspense } from "react";
import { Form } from "./form";
import { LoaderCircleIcon } from "lucide-react";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-6 py-24">
          <LoaderCircleIcon className="h-12 w-12 animate-spin" />
        </div>
      }
    >
      <div className="flex items-center justify-center p-6">
        <Form />
      </div>
    </Suspense>
  );
}
