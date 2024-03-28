import { Suspense } from "react";
import { Form } from "./form";

export default function Home() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="flex items-center justify-center p-6">
        <Form />
      </div>
    </Suspense>
  );
}
