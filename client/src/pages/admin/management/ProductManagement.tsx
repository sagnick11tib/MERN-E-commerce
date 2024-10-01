import { ChangeEvent, FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar"
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { useProductDetailsQuery, useUpdateProductMutation, useDeleteProductMutation } from "../../../redux/api/productAPI";
import { useNavigation, useParams } from "react-router-dom";
//import { useForm, SubmitHandler } from "react-hook-form"

const ProductManagement = () => {

  // const { user }  = useSelector((state: {userReducer: UserReducerInitialState}) => state.userReducer);

  // const params = useParams();
  // const navigate = useNavigation();

  // const { data, isLoading, isError } = useProductDetailsQuery(params.id!);

  // const { price, mainPhoto, name, stock, category, description } =
  //  data!.data!.product || {
  //   price: 0,
  //   mainPhoto: "",
  //   name: "",
  //   stock: 0,
  //   category: "",
  //   description: ""
  // };

  // const [ buttonLoading, setButtonLoading ] = useState<boolean>(false);
  // const [ priceUpdate, setPriceUpdate ] = useState<number>(price);
  // const [ stockUpdate, setStockUpdate ] = useState<number>(stock);
  // const [ nameUpdate, setNameUpdate ] = useState<string>(name);
  // const [ categoryUpdate, setCategoryUpdate ] = useState<string>(category);
  // const [ descriptionUpdate, setDescriptionUpdate ] = useState<string>(description);

  // const [ updateProduct ] = useUpdateProductMutation();
  // const [ deleteProduct ] = useDeleteProductMutation();

  // const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setButtonLoading(true);
  //   try {
  //     const formData = new FormData(); //formdata is a 

  //     if(nameUpdate) formData.set("name", nameUpdate);
  //     if(descriptionUpdate) formData.set("description", descriptionUpdate);
  //     if(priceUpdate) formData.set("price", priceUpdate.toString());
  //     if(stockUpdate !== undefined) formData.set("stock", stockUpdate.toString());
  //     if(categoryUpdate) formData.set("category", categoryUpdate);

  //     const res = await updateProduct({
  //       formData,
  //       userId: user?._id!,
  //       productId: data?.data?.product._id!,
  //     });

      
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setButtonLoading(false);
  //   }
  // }

  const image: string = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  const [name, setName] = useState<string>("Puma Shoes");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [photo, setPhoto] = useState<string>(image);

  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [photoUpdate, setPhotoUpdate] = useState<string>(photo);

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];
    const reader: FileReader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if(typeof reader.result === "string") setPhotoUpdate(reader.result);
    }
    
  }
}

const SubmitHandler = (e: FormEvent<HTMLFormElement>) =>{
  e.preventDefault();
  setName(nameUpdate);
  setPrice(priceUpdate);
  setStock(stockUpdate);
  setPhoto(photoUpdate);
}


  return (
    <>
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <section>
        <strong>ID - 99 </strong>
        <img src={photo} alt="Product" />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{price}</h3>
        </section>
        <article>
        <button className="product-delete-btn" >
                <FaTrash />
              </button>
          <form onSubmit={SubmitHandler}>
            <h2>Manage</h2>
            <div>
              <label>Name</label>
              <input
              required
              type="text"
              placeholder="Name"
              value={nameUpdate}
              onChange={e => setNameUpdate(e.target.value)}
               />
            </div>

            <div>
              <label>Price</label>
              <input
              required
              type="number"
              placeholder="Price"
              value={priceUpdate}
              onChange={e => setPriceUpdate(parseInt(e.target.value))}
               />
            </div>

            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stockUpdate}
                onChange={(e) => setStockUpdate(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Photos</label>
              <input
              required
              type="file"
              accept="image/*"
              multiple
              onChange={changeImageHandler}
               />
            </div>

            {photoUpdate && <img src={photoUpdate} />}
            <button type="submit">Update</button>

          </form>
        </article>
      </main>

    </div>
    </>
  )
}

export default ProductManagement;