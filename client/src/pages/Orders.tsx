import { ColumnDef } from '@tanstack/react-table';
import { ReactElement, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { UserReducerInitialState } from '../types/reducer-types';
import { useMyOrderQuery } from '../redux/api/orderAPI';
import { CustomError } from '../types/api-types';
import TableHOC from '../components/admin/TableHOC';
import { Skeleton } from '../components/Loader';


interface DataType {
  _id: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
}

const columns: ColumnDef<DataType>[] = [
  {
    header: "ID",
    accessorKey: "_id"
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
  }
]

const Orders = () => {

  const { user } = useSelector((state: { userReducer: UserReducerInitialState}) => state.userReducer);

  const { isLoading, data, isError, error } = useMyOrderQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]); 

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  //hi

  useEffect(() => {
    if (data && data!.data!.orders) {
      setRows(data!.data!.orders.map((i: any)=> (
        {
          _id: i._id,
          amount: i.total,
          discount: i.discount,
          quantity: i.orderItems.length,
          status: (
            <span
              className={
                i.status === "Processing"
                  ? "red"
                  : i.status === "Shipped"
                  ? "green"
                  : "purple"
              }
            >
              {i.status}
            </span>
          ),
        }
      )));
    } 
  },[data]);

  const orderTable = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Orders",
    rows.length > 6
  )();


  return (
   <>
   <div className="container">
    <h1>My Orders</h1>
    {
      isLoading ? <Skeleton length={20} /> : orderTable
    }
    </div>
   </>
  )
}

export default Orders