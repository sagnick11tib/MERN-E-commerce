import { useState } from "react";
import ProductCard from "../components/ProductCard";

const Search = () => {
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [category, setCategory] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const addToCartHandler = () => {}
  const isPrevPage = page > 1;
  const isNextPage = page < 4;
  return (
    <div className="flex">
      <aside className="w-1/4 p-4 bg-gray-100">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Sort</h4>
          <select 
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold mb-2">Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <h4 className="font-semibold mb-2">Category</h4>
          <select 
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">All</option>
            <option value="sample1">Sample1</option>
            <option value="sample2">Sample2</option>
          </select>
        </div>
      </aside>
      <main className="w-3/4 p-4">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <input 
          type="text" 
          placeholder="Search by name..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        <div className="grid grid-cols-1 gap-4">
          <ProductCard 
            productId='123456'
            name='Macbook'
            price={129999}
            stock={20}
            handler={addToCartHandler}
            photos={[{ url: "https://m.media-amazon.com/images/I/618d5bS2lUL._SX679_.jpg" }]}  // Wrap the photo URL in an array
          />
        </div>
        <article className="flex justify-between items-center mt-4">
          <button 
            disabled={!isPrevPage} 
            onClick={() => setPage((prev)=> prev - 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Prev
          </button>
          <span>{page} of {4}</span>
          <button 
            disabled={!isNextPage} 
            onClick={() => setPage((prev)=> prev + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </article>
      </main>
    </div>
  )
}

export default Search;
