import TableHOC from '../../components/admin/TableHOC'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { ReactElement, useState, useCallback } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columns: ColumnDef<DataType>[] = [
  {
    header: "User",
    accessorKey: "user"
  },
  {
    header: "Amount",
    accessorKey: "amount"
  },
  {
    header: "Discount",
    accessorKey: "discount"
  },
  {
    header: "Quantity",
    accessorKey: "quantity"
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => row.original.status
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: ({ row }) => row.original.action
  }
]

const arr: DataType[] = [
  {
    user: "Ujjala Radha Tung",
    amount: 500,
    discount: 50,
    quantity: 5,
    status: <span className="red">Processing</span>,
    action: <Link to={`/admin/transaction/radha`}>Manage</Link>,
  },
  {
    user: "Sagnick Manna",
    amount: 600,
    discount: 66,
    quantity: 1,
    status: <span className="green">Shipped</span>,
    action: <Link to={`/admin/transaction/radha`}>Manage</Link>,
  },
  {
    user: "Mahasweta Tung",
    amount: 800,
    discount: 100,
    quantity: 10,
    status: <span className="purple">Delivered</span>,
    action: <Link to={`/admin/transaction/radha`}>Manage</Link>,
  },
  {
    user: "Satwik Manna",
    amount: 1000,
    discount: 200,
    quantity: 20,
    status: <span className="red">Processing</span>,
    action: <Link to={`/admin/transaction/radha`}>Manage</Link>,
  },
  {
    user: "Chinmoy Balaram Das",
    amount: 580,
    discount: 20,
    quantity: 8,
    status: <span className="purple">Delivered</span>,
    action: <Link to={`/admin/transaction/radha`}>Manage</Link>,
  },
  {
    user: "Sayan Ghoroi",
    amount: 200,
    discount: 10,
    quantity: 4,
    status: <span className="green">Shipped</span>,
    action: <Link to={`/admin/transaction/radha`}>Manage</Link>,
  },
  {
    user: "Ujjala Radha Tung",
    amount: 500,
    discount: 50,
    quantity: 5,
    status: <span className="red">Processing</span>,
    action: <Link to={`/admin/transaction/radha`}>Manage</Link>,
  },
  {
    user: "Ujjala Radha Tung",
    amount: 500,
    discount: 50,
    quantity: 5,
    status: <span className="red">Processing</span>,
    action: <Link to={`/admin/transaction/radha`}>Manage</Link>,
  },
  {
    user: "Ujjala Radha Tung",
    amount: 500,
    discount: 50,
    quantity: 5,
    status: <span className="red">Processing</span>,
    action: <Link to={`/admin/transaction/radha`}>Manage</Link>,
  },{
    user: "Ujjala Radha Tung",
    amount: 500,
    discount: 50,
    quantity: 5,
    status: <span className="red">Processing</span>,
    action: <Link to={`/admin/transaction/radha`}>Manage</Link>,
  },
];


const Transaction = () => {
  const [ data ] = useState<DataType[]>(arr);

  const transactionTable = useCallback(TableHOC<DataType>(
    columns,
    data,
    "dashboard-product-box",
    "Transactions",
    true
    ), []);
  return (
    <div className="adminContainer">
      <AdminSidebar />
      <main>
        {
          transactionTable()
        }
      </main>
    </div>
  )
}

export default Transaction