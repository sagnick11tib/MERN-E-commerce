import TableHOC from '../../components/admin/TableHOC'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { ColumnDef } from '@tanstack/react-table'
import { ReactElement, useCallback, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
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

const arr: DataType[] = [
  {
   avatar: <img src="http://res.cloudinary.com/dtr59xel0/image/upload/v1725865544/hmvnbxidwqvzy5lkmwuf.png" />,
   name: "Ujjala Radha Tung",
   gender: "Female",
   email: "ujjalaradha1325@gmail.com",
   role: "Admin",
   action: <button ><FaTrash /></button>
  },
  {
    avatar: <img src="http://res.cloudinary.com/dtr59xel0/image/upload/v1725865544/hmvnbxidwqvzy5lkmwuf.png" />,
    name: "Ujjala Radha Tung",
    gender: "Female",
    email: "ujjalaradha1325@gmail.com",
    role: "Admin",
    action: <button ><FaTrash /></button>
  },
  {
    avatar: <img src="http://res.cloudinary.com/dtr59xel0/image/upload/v1725865544/hmvnbxidwqvzy5lkmwuf.png" />,
    name: "Ujjala Radha Tung",
    gender: "Female",
    email: "ujjalaradha1325@gmail.com",
    role: "Admin",
    action: <button ><FaTrash /></button>
  },
  {
    avatar: <img src="http://res.cloudinary.com/dtr59xel0/image/upload/v1725865544/hmvnbxidwqvzy5lkmwuf.png" />,
    name: "Ujjala Radha Tung",
    gender: "Female",
    email: "ujjalaradha1325@gmail.com",
    role: "Admin",
    action: <button ><FaTrash /></button>
  },
  {
    avatar: <img src="http://res.cloudinary.com/dtr59xel0/image/upload/v1725865544/hmvnbxidwqvzy5lkmwuf.png" />,
    name: "Ujjala Radha Tung",
    gender: "Female",
    email: "ujjalaradha1325@gmail.com",
    role: "Admin",
    action: <button ><FaTrash /></button>
  },
  {
    avatar: <img src="http://res.cloudinary.com/dtr59xel0/image/upload/v1725865544/hmvnbxidwqvzy5lkmwuf.png" />,
    name: "Ujjala Radha Tung",
    gender: "Female",
    email: "ujjalaradha1325@gmail.com",
    role: "Admin",
    action: <button ><FaTrash /></button>
  },
  {
    avatar: <img src="http://res.cloudinary.com/dtr59xel0/image/upload/v1725865544/hmvnbxidwqvzy5lkmwuf.png" />,
    name: "Ujjala Radha Tung",
    gender: "Female",
    email: "ujjalaradha1325@gmail.com",
    role: "Admin",
    action: <button ><FaTrash /></button>
  },
];

const Customers = () => {
  const [ data ] = useState<DataType[]>(arr);
  const customerDetails = useCallback(TableHOC<DataType>(
    columns,
    data,
    "dashboard-product-box",
    "Customers",
     true
  ),[]);
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>
        {
          customerDetails()
        }
      </main>
    </div>
  )
}

export default Customers