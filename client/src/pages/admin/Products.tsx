
import { ReactElement, useState, useCallback } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar'
import TableHOC from '../../components/admin/TableHOC'
import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement; 
}

const columns: ColumnDef<DataType>[] = [
  {
    header: "Photo",
    accessorKey: "photo",
    cell: ({ row }) => row.original.photo
  },
  {
    header: "Name",
    accessorKey: "name"
  },
  {
    header: "Price",
    accessorKey: "price"
  },
  {
    header: "Stock",
    accessorKey: "stock"
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: ({ row }) => row.original.action
  }
];



const arr: DataType[] = [
  {
    photo: <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Shoes" />,
    name: "Shoes",
    price: 500,
    stock: 10,
    action: <Link to="/admin/product/sagar">Manage</Link>
  },
  {
    photo: <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1546&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Pen" />,
    name: "Pen",
    price: 50,
    stock: 100,
    action: <Link to="/admin/product/sagar">Manage</Link> 
  },
  {
    photo: <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Shoes" />,
    name: "Shoes",
    price: 500,
    stock: 10,
    action: <Link to="/admin/product/sagar">Manage</Link>
  },
  {
    photo: <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1546&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Pen" />,
    name: "Pen",
    price: 50,
    stock: 100,
    action: <Link to="/admin/product/sagar">Manage</Link> 
  },
  {
    photo: <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Shoes" />,
    name: "Shoes",
    price: 500,
    stock: 10,
    action: <Link to="/admin/product/sagar">Manage</Link>
  },
  {
    photo: <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1546&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Pen" />,
    name: "Pen",
    price: 50,
    stock: 100,
    action: <Link to="/admin/product/sagar">Manage</Link> 
  },
  {
    photo: <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Shoes" />,
    name: "Shoes",
    price: 500,
    stock: 10,
    action: <Link to="/admin/product/sagar">Manage</Link>
  },
  {
    photo: <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1546&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Pen" />,
    name: "Pen",
    price: 50,
    stock: 100,
    action: <Link to="/admin/product/sagar">Manage</Link> 
  },
  {
    photo: <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Shoes" />,
    name: "Shoes",
    price: 500,
    stock: 10,
    action: <Link to="/admin/product/sagar">Manage</Link>
  },
  {
    photo: <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1546&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Pen" />,
    name: "Pen",
    price: 56555750,
    stock: 100,
    action: <Link to="/admin/product/sagar">Manage</Link> 
  }
];

const Products = () => {

  const [ data, setData ] = useState<DataType[]>(arr);
  
const ProductTable = useCallback(TableHOC<DataType>(
  columns,
  data,
  "dashboard-product-box",
  "Products",
  true
),[]);



  return (
    <div className='admin-container'>
      <AdminSidebar />
      <main>
        {
          ProductTable()
        }
      </main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  )
}

export default Products