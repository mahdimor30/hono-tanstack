import { createFileRoute } from "@tanstack/react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { api } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

export const expensesQueryOptions = {
  queryKey: ["expenses"],
  queryFn: getTotalSpent,
};

export const Route = createFileRoute("/")({
  component: Page,
});

// App.js

async function getTotalSpent() {
  const res = await api.expenses["total-spent"].$get();

  if (!res.ok) throw new Error("Failed to fetch total spent");
  // return await res.json();
  return await res.json();
}

function Page() {
  const { data } = useQuery(expensesQueryOptions);

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>How much have you spent?</CardDescription>
      </CardHeader>
      <CardContent>{data?.total}</CardContent>
    </Card>
  );
}
