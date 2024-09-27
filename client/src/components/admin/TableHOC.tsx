import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
} from "@tanstack/react-table"
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";



function TableHOC<T extends Object>(
  columns: ColumnDef<T, any>[],
  data: T[],
  containerClassname: string,
  heading: string,
  showPagination: boolean = false
){
  return function HOC(){
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      initialState: {
        pagination: {
          pageSize: 6
        }
      }
    });
  
    const { pageIndex } = table.getState().pagination;
  
  
    return (
      <>
      <div className={containerClassname}>
        <h2 className="heading">{heading}</h2>
        <table className="table">
          <thead>
            {
              table.getHeaderGroups().map(headerGroup =>(
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header =>(
                    <th key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        style={{ cursor: "pointer" }}>
                      {
                        flexRender(header.column.columnDef.header, header.getContext())
                      }
                      {
                        header.column.getIsSorted() && (
                          <span>
                            {" "}
                            {header.column.getIsSorted() === "desc" ? (
                             <AiOutlineSortDescending />
                            ) : (
                             <AiOutlineSortAscending />
                            )}
                          </span>
                        )}
                    </th>
                  ))}
                </tr>
              ))}
          </thead>
          <tbody>
            {
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {
                    row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        }
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
        {
          showPagination && (
            <div className="table-pagination">
              <button disabled={!table.getCanPreviousPage()} onClick={()=>table.previousPage()}>Prev</button>
              <span>{`${pageIndex + 1} of ${table.getPageCount()}`}</span>
              <button disabled={!table.getCanNextPage()} onClick={()=>table.nextPage()}>Next</button>
            </div>
          ) 
        }
      </div>
      </>
    )
  }
}



export default TableHOC