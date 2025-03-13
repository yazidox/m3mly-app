import { createClient } from "../../../../../../supabase/server";
import { notFound, redirect } from "next/navigation";
import { FileText } from "lucide-react";
import PrintButton from "@/components/print-button";
import { formatCurrency } from "@/lib/formatters";

export default async function InvoicePdfPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/factory-dashboard");
  }

  // Check if user is a factory owner
  const { data: userData } = await supabase
    .from("users")
    .select("*, factories(*)")
    .eq("id", user.id)
    .single();

  if (!userData || userData.role !== "factory_owner" || !userData.factory_id) {
    return redirect("/dashboard?error=not_factory_owner");
  }

  // Fetch invoice data
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*, orders(*, products(name, price))")
    .eq("id", params.id)
    .eq("factory_id", userData.factory_id)
    .single();

  if (invoiceError || !invoice) {
    console.error("Error fetching invoice:", invoiceError);
    return notFound();
  }

  const order = invoice.orders;

  return (
    <div
      className="min-h-screen bg-white p-8 max-w-4xl mx-auto print:p-0"
      id="invoice-pdf"
    >
      {/* Print-optimized invoice */}
      <div className="bg-white rounded-xl p-8 print:p-4 print:shadow-none">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
            <p className="text-gray-600">#{invoice.invoice_number}</p>
          </div>
          <div className="text-right">
            <div className="font-bold text-xl">{userData.factories.name}</div>
            <div className="text-gray-600">{userData.factories.location}</div>
            <div className="text-gray-600">
              info@{userData.factories.name.toLowerCase().replace(/\s+/g, "")}
              .com
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-2">
              BILL TO
            </h2>
            <p className="font-semibold">{order.full_name}</p>
            <p>{order.company}</p>
            <p className="whitespace-pre-line">{order.shipping_address}</p>
            <p>{order.email}</p>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-500 mb-2">
                  INVOICE DATE
                </h2>
                <p>{new Date(invoice.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-500 mb-2">
                  DUE DATE
                </h2>
                <p>
                  {invoice.due_date
                    ? new Date(invoice.due_date).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-gray-500 mb-2">
                STATUS
              </h2>
              <p
                className={
                  invoice.status === "paid"
                    ? "text-green-600 font-semibold"
                    : "text-orange-600 font-semibold"
                }
              >
                {invoice.status.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead className="border-b-2 border-gray-300">
              <tr>
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-right py-3 px-4">Quantity</th>
                <th className="text-right py-3 px-4">Unit Price</th>
                <th className="text-right py-3 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">
                  {order.products.name}
                  <div className="text-sm text-gray-500">
                    Order #{order.id.substring(0, 8)}
                  </div>
                </td>
                <td className="text-right py-3 px-4">{order.quantity}</td>
                <td className="text-right py-3 px-4">
                  {formatCurrency(Number(order.products.price))}
                </td>
                <td className="text-right py-3 px-4">
                  {formatCurrency(
                    order.quantity * Number(order.products.price),
                  )}
                </td>
              </tr>
            </tbody>
            <tfoot className="border-t-2 border-gray-300">
              <tr>
                <td colSpan={2}></td>
                <td className="text-right py-3 px-4 font-semibold">Subtotal</td>
                <td className="text-right py-3 px-4">
                  {formatCurrency(Number(invoice.amount))}
                </td>
              </tr>
              <tr>
                <td colSpan={2}></td>
                <td className="text-right py-3 px-4 font-semibold">Tax (0%)</td>
                <td className="text-right py-3 px-4">{formatCurrency(0)}</td>
              </tr>
              <tr>
                <td colSpan={2}></td>
                <td className="text-right py-3 px-4 font-semibold">
                  Total Due
                </td>
                <td className="text-right py-3 px-4 font-bold">
                  {formatCurrency(Number(invoice.amount))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {invoice.notes && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 mb-2">NOTES</h2>
            <p className="p-4 bg-gray-50 rounded-md">{invoice.notes}</p>
          </div>
        )}

        <div className="text-center text-sm text-gray-500 mt-12 border-t pt-6">
          <p>Thank you for your business!</p>
          <p>
            Payment is due by{" "}
            {invoice.due_date
              ? new Date(invoice.due_date).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Download button - only visible on screen, not when printing */}
      <div className="mt-8 flex justify-center print:hidden">
        <PrintButton>
          <FileText className="h-4 w-4" />
          Print / Download PDF
        </PrintButton>
      </div>
    </div>
  );
}
