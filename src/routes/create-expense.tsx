import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { useForm } from "@tanstack/react-form";
import type { FieldApi } from "@tanstack/react-form";
import { api } from "@/lib/api";

export const Route = createFileRoute("/create-expense")({
  component: CreateExpense,
});

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(", ")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

function CreateExpense() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: { title: "", amount: 0 },
    onSubmit: async (props) => {
      await new Promise((r) => setTimeout(r, 1000));
      const res = await api.expenses.$post({ json: { ...props.value } });

      if (!res.ok) {
        throw new Error("Failed to create expense");
      }

      navigate({ to: "/expenses" });
      console.log(props);
    },
  });

  return (
    <div className="p-2 max-w-3xl m-auto">
      <h2>Create Expense Page</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="title"
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Title</Label>
              <Input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="text"
                id={field.name}
              />
              <FieldInfo field={field} />
            </>
          )}
        />

        <form.Field
          name="amount"
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Amount</Label>
              <Input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                id={field.name}
                type="number"
              />
              <FieldInfo field={field} />
            </>
          )}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "createing..." : "Create Expense"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
