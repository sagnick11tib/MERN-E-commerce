import { FormEvent, useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar"
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { useProductDetailsQuery, useUpdateProductMutation, useDeleteProductMutation } from "../../../redux/api/productAPI";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useFileHandler } from "6pp";
import { responseToast } from "../../../utils/features";
import { Skeleton } from "../../../components/Loader";
//import { useForm, SubmitHandler } from "react-hook-form"

const ProductManagement = () => {

   const { user }  = useSelector((state: {userReducer: UserReducerInitialState}) => state.userReducer);

   const params = useParams(); //it is used to get the id from the url
   const navigate = useNavigate(); // it is used to navigate to different pages

   const { data, isLoading, isError } = useProductDetailsQuery(params.id!); 

  const { price, mainPhoto, name, stock, category, description }: any =
   data?.data!.product || {
    price: 0,
    mainPhoto: "",
    name: "",
    stock: 0,
    category: "",
    description: ""
  };

  const [ buttonLoading, setButtonLoading ] = useState<boolean>(false);
  const [ priceUpdate, setPriceUpdate ] = useState<number>(price);
  const [ stockUpdate, setStockUpdate ] = useState<number>(stock);
  const [ nameUpdate, setNameUpdate ] = useState<string>(name);
  const [ categoryUpdate, setCategoryUpdate ] = useState<string>(category);
  const [ descriptionUpdate, setDescriptionUpdate ] = useState<string>(description);

  const [ updateProduct ] = useUpdateProductMutation();
  const [ deleteProduct ] = useDeleteProductMutation();

  const mainPhotoFile = useFileHandler("single",5,1);

  const subPhotosFiles = useFileHandler("multiple",5,5);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonLoading(true);
    try {
      const formData = new FormData();
  
      // Check which fields have changed and append only those to formData
      if (nameUpdate !== name) formData.set("name", nameUpdate); 
      if (descriptionUpdate !== description) formData.set("description", descriptionUpdate);
      if (priceUpdate !== price) formData.set("price", priceUpdate.toString());
      if (stockUpdate !== stock) formData.set("stock", stockUpdate.toString());
      if (categoryUpdate !== category) formData.set("category", categoryUpdate);
  
      // Append files if they are selected
      if (mainPhotoFile.file) {
        formData.append("mainPhoto", mainPhotoFile.file);
      }
      if (subPhotosFiles.file && subPhotosFiles.file.length > 0) {
        subPhotosFiles.file.forEach((file) => {
          formData.append("subPhotos", file);
        });
      }
  
      const res = await updateProduct({
        formData,
        userId: user?._id!,
        productId: data?.data?.product._id!
      });
  
      responseToast(res, navigate, "/admin/product");
    } catch (error) {
      console.log(error);
    } finally {
      setButtonLoading(false);
    }
  };

  const deleteHandler = async () => {
    const res = await deleteProduct({
      userId: user?._id!,
      productId: data?.data?.product._id!
    });

    responseToast(res, navigate, "/admin/product");
  };

  useEffect(() => {
    if (data) {
      setNameUpdate(data?.data!.product.name);
      setPriceUpdate(data?.data!.product.price);
      setStockUpdate(data?.data!.product.stock);
      setCategoryUpdate(data?.data!.product.category);
      setDescriptionUpdate(data?.data!.product.description);
    }
  }, [data]);

  if (isError) return <Navigate to={"/404"} />;

  return (
    <>
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
      {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
        <section>
        <strong>ID - {data?.data?.product._id} </strong>
        <img src={mainPhoto.url} alt="Product" />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{price}</h3>
        </section>
        <article>
        <button className="product-delete-btn" onClick={deleteHandler} >
                <FaTrash />
              </button>
          <form onSubmit={submitHandler}>
            <h2>Manage</h2>
            <div>
              <label>Name</label>
              <input
              
              type="text"
              placeholder="Name"
              value={nameUpdate}
              onChange={e => setNameUpdate(e.target.value)}
               />
            </div>

            <div>
              <label>Price</label>
              <input
              
              type="number"
              placeholder="Price"
              value={priceUpdate}
              onChange={e => setPriceUpdate(parseInt(e.target.value))}
               />
            </div>

            <div>
              <label>Stock</label>
              <input
                
                type="number"
                placeholder="Stock"
                value={stockUpdate}
                onChange={(e) => setStockUpdate(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Main Photo</label>
              <input
              
              type="file"
              accept="image/*"
              
              onChange={mainPhotoFile.changeHandler}
               />
            </div>

            <div>
              <label>Sub Photo</label>
              <input
              
              type="file"
              accept="image/*"
              multiple
              onChange={subPhotosFiles.changeHandler}
               />
            </div>

            {mainPhotoFile.preview && <img src={mainPhotoFile.preview} />}
            <button disabled={buttonLoading} type="submit">Update</button>

          </form>
        </article>
        </>
        )};
      </main>

    </div>
    </>
  )
}

export default ProductManagement;