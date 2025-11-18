"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface WebsiteFormValues {
  name: string;
  slug: string;
  description: string;
}

interface WebsiteFormProps {
  compact?: boolean;
}

const initialValues: WebsiteFormValues = {
  name: "",
  slug: "",
  description: "",
};

export default function WebsiteForm({ compact }: WebsiteFormProps) {
  const [values, setValues] = useState(initialValues);

  function handleChange(field: keyof WebsiteFormValues) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("submit", values);
    setValues(initialValues);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
      <Input
        label="Nombre"
        placeholder="Landing IA"
        value={values.name}
        onChange={handleChange("name")}
      />
      <Input
        label="Slug"
        placeholder="landing-ia"
        value={values.slug}
        onChange={handleChange("slug")}
      />
      {!compact && (
        <Input
          label="Descripción"
          placeholder="Breve contexto para la IA"
          value={values.description}
          onChange={handleChange("description")}
        />
      )}
      <Button type="submit">Guardar borrador</Button>
    </form>
  );
}
