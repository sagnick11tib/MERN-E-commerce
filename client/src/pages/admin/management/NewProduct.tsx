import { ChangeEvent, FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useNewProductMutation } from "../../../redux/api/productAPI";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { responseToast } from "../../../utils/features";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { useFileHandler } from "6pp";

const NewProduct = () => {
  

  const { user } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer);

  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  const [ name, setName ] = useState<string>("");
  const [ description, setDescription ] = useState<string>("");
  const [ price, setPrice ] = useState<number>(1000);
  const [ stock, setStock ] = useState<number>(1);
  const [ category, setCategory ] = useState<string>("");
  
  const [ newProduct ] = useNewProductMutation();

  const navigate = useNavigate();

  const mainPhoto = useFileHandler("single", 5, 1);

  console.log(typeof mainPhoto.file); // File file is an 

  const subPhotos = useFileHandler("multiple", 5, 5);


  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    setIsLoading(true);

    try {
      
      if ( !name || !description || !price || stock < 0 || !category ) return;

      if ( !mainPhoto.file || !subPhotos.file || subPhotos.file.length === 0 ) return;

      const formData = new FormData();

      formData.set("name", name);
      formData.set("description", description);
      formData.set("price", price.toString());
      formData.set("stock", stock.toString());
      formData.set("category", category);

      mainPhoto.file && formData.append("mainPhoto", mainPhoto.file);

      subPhotos.file && subPhotos.file.forEach(file => {
        formData.append("subPhotos", file);
      });

      const res = await newProduct({ _id: user?._id!, formData });

      responseToast(res, navigate, "/admin/product")
    } catch (error) {

      console.log(error);

    } finally {

      setIsLoading(false);

    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                required
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Category</label>
              <input
                required
                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label>Feature Photo</label>
              <input
                required
                type="file"
                accept="image/*"
                onChange={mainPhoto.changeHandler}
              />
            </div>
            <div>
              <label>Sub Photos</label>
              <input
                required
                type="file"
                accept="image/*"
                multiple
                onChange={subPhotos.changeHandler}
              />
            </div>
            {
              mainPhoto.error && <p>{mainPhoto.error}</p>
            }
            {
              mainPhoto.preview && <img src={mainPhoto.preview} alt="mainPhoto" />
            }
            {
              subPhotos.error && <p>{subPhotos.error}</p>
            }
            {
              subPhotos.preview && subPhotos.preview.map((photo, i) => (
                <img key={i} src={photo} alt="subPhoto" />
              ))
            }
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
