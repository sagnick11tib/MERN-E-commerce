import { ChangeEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar"
//import { useForm, SubmitHandler } from "react-hook-form"

const NewProduct = () => {
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [description, setDescription] = useState<string>("");
  const [photos, setPhotos] = useState<any>([]);

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];
    const reader: FileReader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if(typeof reader.result === "string") setPhotos(reader.result);
    }
    
  }
}
  return (
    <>
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
              required
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
               />
            </div>
            <div>
              <label>Description</label>
              <textarea
              required
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
               />
            </div>

            <div>
              <label>Price</label>
              <input
              required
              type="number"
              placeholder="Price"
              value={price}
              onChange={e => setPrice(parseInt(e.target.value))}
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
              onChange={e => setCategory(e.target.value)}
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

            {photos && <img src={photos} />}
            <button type="submit">Create</button>

          </form>
        </article>
      </main>

    </div>
    </>
  )
}

export default NewProduct