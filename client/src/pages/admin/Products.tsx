
import { ReactElement, useState, useCallback, act, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar'
import TableHOC from '../../components/admin/TableHOC'
import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { useAllProductsQuery } from '../../redux/api/productAPI';
import toast from 'react-hot-toast';
import { CustomError } from '../../types/api-types';
import { useSelector } from 'react-redux';
import { UserReducerInitialState } from '../../types/reducer-types';
import { Skeleton } from '../../components/Loader';

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

  const { user } = useSelector( (state: { userReducer:UserReducerInitialState }) => state.userReducer);

   const { data, isError, error, isLoading } =  useAllProductsQuery(user?._id!);

   //console.log(data);

  const [ rows, setRows ] = useState<DataType[]>([]);

  if (isError) toast.error((error as CustomError).data.message);

  useEffect(() =>{
    if (data && data!.data!.products) {
      setRows(data!.data!.products.map((i: any) => ({
        photo: <img src={i.mainPhoto.url} alt={i.name} />, 
        name: i.name, 
        price: i.price, 
        stock: i.stock, 
        action: <Link to={`/admin/product/${i._id}`}>Manage</Link> 
      })));
    }
  },[data])
  
  
const ProductTable = TableHOC<DataType>(
  columns,
  rows,
  "dashboard-product-box",
  "Products",
  rows.length > 6
)()



  return (
    <div className='admin-container'>
      <AdminSidebar />
      <main>
        {isLoading ? <Skeleton length={20} /> : ProductTable }
      </main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  )
}

export default Products