"use client";

import * as React from "react";
import { useSearchParams } from "@search-params/core";
import { z } from "zod";
import {
  useRouter,
  useSearchParams as _useSearchParams,
} from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().catch("my-app"),
  framework: z
    .union([
      z.literal("next"),
      z.literal("sveltekit"),
      z.literal("astro"),
      z.literal("nuxt"),
    ])
    .optional()
    .catch("next"),
});

export const Form: React.FC = () => {
  const searchParams = _useSearchParams();
  const query = searchParams.toString();
  const router = useRouter();

  const { name, framework, setQuery } = useSearchParams({
    schema,
    query,
    router,
  });

  function formAction(formData: FormData) {
    const output = schema.safeParse({
      name: formData.get("name"),
      framework: formData.get("framework"),
    });

    return !output.success
      ? toast.error("Something went wrong")
      : toast.success(JSON.stringify(output.data));
  }

  return (
    <form className="w-full max-w-md" action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Name of your project"
                defaultValue={name}
                onChange={(e) =>
                  setQuery({
                    name: e.currentTarget.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Framework</Label>
              <Select
                name="framework"
                defaultValue={framework}
                onValueChange={(value) =>
                  setQuery({
                    framework: value as typeof framework,
                  })
                }
              >
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Deploy</Button>
        </CardFooter>
      </Card>
    </form>
  );
};
