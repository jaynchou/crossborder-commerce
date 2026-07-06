import { AdminLayout } from "@/components/AdminLayout";
import { listCustomers } from "@/lib/store";

export default function CustomersPage() {
  const customers = listCustomers();

  return (
    <AdminLayout eyebrow="CRM" title="Customers">
      <section className="panel">
        <h2>Customer records</h2>
        <div className="table">
          {customers.map((customer) => (
            <div className="tableRow customerRow" key={customer.id}>
              <span>{customer.name}</span>
              <span>{customer.email}</span>
              <span>{customer.phone ?? "No phone"}</span>
              <span>{customer.country}</span>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
