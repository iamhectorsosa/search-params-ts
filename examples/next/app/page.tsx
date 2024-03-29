import * as React from "react";
import { Form } from "./form";
import { LoaderCircleIcon } from "lucide-react";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-6 py-24">
          <LoaderCircleIcon className="size-12 animate-spin" />
        </div>
      }
    >
      <div className="flex items-center justify-center p-6">
        <Form />
      </div>
    </Suspense>
  );
}
