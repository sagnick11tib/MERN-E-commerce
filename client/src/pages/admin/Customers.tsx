import TableHOC from '../../components/admin/TableHOC'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { ColumnDef } from '@tanstack/react-table'
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { UserReducerInitialState } from '../../types/reducer-types';
import { useAllOrdersQuery } from '../../redux/api/orderAPI';
import { useAllUsersQuery, useDeleteUserMutation } from '../../redux/api/userAPI';
import { responseToast } from '../../utils/features';
import { CustomError } from '../../types/api-types';
import toast from 'react-hot-toast';
import { Skeleton } from '../../components/Loader';
interface DataType {
  avatar: ReactElement;
  name: string;
  gender: string;
  email: string;
  role: string;
  action: ReactElement;
}
const columns: ColumnDef<DataType>[] = [
  {
    header: "Avatar",
    accessorKey: "avatar",
    cell: ({ row }) => row.original.avatar
  },
  {
    header: "Name",
    accessorKey: "name"
  },
  {
    header: "Gender",
    accessorKey: "gender"
  },
  {
    header: "Email",
    accessorKey: "email"
  },
  {
    header: "Role",
    accessorKey: "role"
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: ({ row }) => row.original.action
  }
]


const Customers = () => {

  const { user } = useSelector( (state: { userReducer:UserReducerInitialState }) => state.userReducer);

  //console.log(user?._id);

  const { isLoading, data, isError, error } = useAllUsersQuery(user?._id!);

  const [ rows, setRows ] = useState<DataType[]>([]);

  const [ deleteUser ] = useDeleteUserMutation();

  const deleteHandler = async (userId: string) => {

    const res = await deleteUser({
                                  userId,
                                  adminUserId: user?._id! });
    responseToast(res, null, "User Deleted Successfully");

  };

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data && data!.data!.users){
      setRows(data?.data!.users!.map((i: any) => ({
        avatar: (
          <img style={{ borderRadius: "50%"}} src={i.photo} alt={i.name} />
        ),
        name: i.name,
        email: i.email,
        gender:i.gender,
        role: i.role,
        action: (
          <button onClick={() => deleteHandler(i._id)}><FaTrash /></button>
        )
      })))
    }
  },[data]);

  const customerDetails = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )()
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>
        {
          isLoading ? <Skeleton length={20} /> : customerDetails
        }
      </main>
    </div>
  )
}

export default Customers