
import { ReactElement, useState, useEffect } from 'react';
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