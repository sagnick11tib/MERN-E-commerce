
import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { CustomError } from "../types/api-types";
import { Skeleton } from "../components/Loader";
import { useDispatch } from "react-redux";
import { CartItem } from "../types/types";
import { addToCart } from "../redux/reducer/cartReducer";

const Search = () => {

  
  const { data: categoriesResponse, isLoading: loadingCategories, isError, error } = useCategoriesQuery("");

  const dispatch = useDispatch();

  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [category, setCategory] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const { data: searchedData, isLoading: productLoading } = useSearchProductsQuery({ 
                                            price: maxPrice, 
                                            search, 
                                            sort, 
                                            category, 
                                            page
                                           });

                                           //console.log(searchedData);
                                           



  const noProductsFound = searchedData?.data?.products.length === 0;

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error('Out of stock');
    dispatch(addToCart  (cartItem));
    toast.success("Added to cart");
   };

  const isPrevPage = page > 1;
  const isNextPage = page < 4;

  if (isError) toast.error((error as CustomError).data.message)


  
  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select 
            value={sort}
            onChange={e => setSort(e.target.value)} // e.target.value is the value of the selected option = asc or dsc
          >
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>

        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <h4>Category</h4>
          <select 
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">ALL</option>
            {
              !loadingCategories && categoriesResponse?.data?.categories.map((i: any) => (
                <option key={i} value={i}>{i.toUpperCase()}</option>
              ))
            }
          </select>
        </div>
      </aside>
      
      <main>
        <h1>Products</h1>
        <input 
          type="text" 
          placeholder="Search by name..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {
          productLoading ? ( <Skeleton length={10} /> ) : (
            <div className="search-product-list">
              {
                noProductsFound ? (
                  <div className="no-products-found">
                  No products found within the price range of {maxPrice}.
                  </div>
                ):(
                searchedData?.data?.products.map((i: any) => (
                  <ProductCard 
                    key={i._id}
                    productId={i._id}
                    name={i.name}
                    price={i.price}
                    stock={i.stock}
                    handler={addToCartHandler}
                    mainPhoto={{ url: i.mainPhoto.url}}
                  />
                ))
              )
              }
            </div>
          )
        }

        {/* <div>
          <ProductCard 
            productId='123456'
            name='Macbook'
            price={12999}
            stock={20}
            handler={addToCartHandler}
            mainPhoto={{ url: "https://m.media-amazon.com/images/I/618d5bS2lUL._SX679_.jpg" }}
          />
        </div> */}

        {
          searchedData && searchedData.data.totalPage > 1 && ( //  it means that if searchedData is not null and totalPage is greater than or equal to 1 then show the pagination
            <article>
              
              <button 
                disabled={!isPrevPage} 
                onClick={() => setPage((prev) => prev - 1)}
              >
                Prev
              </button>
              <span>{page} of {searchedData.data!.totalPage}</span>
              <button 
                disabled={!isNextPage} 
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </article>
          )
        }
        
        {/* <article>
          <button 
            disabled={!isPrevPage} 
            onClick={() => setPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span>{page} of {searchedData?.totalPage}</span>
          <button 
            disabled={!isNextPage} 
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </article> */}
      </main>
    </div>
  )
}

export default Search;

