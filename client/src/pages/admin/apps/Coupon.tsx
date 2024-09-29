import React from 'react'
import AdminSidebar from '../../../components/admin/AdminSidebar'

const Coupon = () => {
  return (
    <>
     <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard-app-container">
      <h1>Coupon</h1>
      <section>
        <form>
          <input />
          <input />
          <fieldset></fieldset>
          <button>Generate</button>
        </form>
      </section>
      </main>
     </div>
    </>
  )
}

export default Coupon