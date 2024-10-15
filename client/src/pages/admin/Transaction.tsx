import TableHOC from '../../components/admin/TableHOC'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { ReactElement, useState, useCallback, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAllOrdersQuery } from '../../redux/api/orderAPI';
import { UserReducerInitialState } from '../../types/reducer-types';
import { CustomError } from '../../types/api-types';
import toast from 'react-hot-toast';
import { Skeleton } from '../../components/Loader';

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

const Transaction = () => {

  const { user } = useSelector((state: { userReducer: UserReducerInitialState}) => state.userReducer);

  const { isLoading, data, isError, error } = useAllOrdersQuery(user?._id!);
  
  const [ rows, setRows ] = useState<DataType[]>([]);

  if (isError) {
    const err = error  as CustomError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data && data!.data!.orders) {
      setRows(data!.data!.orders.map((i: any) => ({
        user: i.user.name,
        amount: i.total,
        discount: i.discount,
        quantity: i.orderItems.length,
        status: <span className={i.status === "Processing" ? "red" : i.status === "Shipped" ? "green" : "purple"}>{i.status}</span>,
        action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>
      })))
    }
  },[data])

  const transactionTable = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
    )();
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>
        {
         isLoading ? <Skeleton length={20} /> : transactionTable
        }
      </main>
    </div>
  )
}

export default Transaction