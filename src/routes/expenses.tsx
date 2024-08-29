import { serverApi } from "@/lib/api";
import { Await, createFileRoute, defer } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const getAllExpenses = async () => {
  const res = await serverApi.expenses.$get();
  if (!res.ok) {
    throw new Error("Failed to fetch expenses");
  }

  return await res.json();
};

export const Route = createFileRoute("/expenses")({
  component: Expenses,
  // pendingComponent: (props) => {
  //   return <p className="bg-red-600">Loading...</p>;
  // },
  loader: async () => {
    const allExpensesDefer = getAllExpenses();

    return {
      allExpensesDefer: defer(allExpensesDefer),
    };
  },
  errorComponent: (error) => {
    console.log(error);

    return (
      <div>
        {JSON.stringify(error)}
        test
      </div>
    );
  },
});

function Expenses() {
  const { allExpensesDefer } = Route.useLoaderData();

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Table className="p-2 max-w-3xl m-auto">
        <TableCaption>A list of all your expenses</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Suspense fallback={<LodingTable />}>
            <Await promise={allExpensesDefer}>
              {(data) =>
                data.expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.id}</TableCell>
                    <TableCell>{expense.title}</TableCell>
                    <TableCell>{expense.amount}</TableCell>
                  </TableRow>
                ))
              }
            </Await>
          </Suspense>
        </TableBody>
      </Table>
    </div>
  );
}

function LodingTable() {
  return Array(3)
    .fill(0)
    .map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton className="h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4" />
        </TableCell>
      </TableRow>
    ));
}
