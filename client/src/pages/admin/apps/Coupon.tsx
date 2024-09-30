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
        <form className="coupon-form">
          <input />
          <input />
          <fieldset>
            <legend>Include</legend>
            <input />
            <span>Numbers</span>
            <input />
            <span>Characters</span>
            <input />
            <span>Symbols</span>
          </fieldset>
          <button>Generate</button>
        </form>
      </section>
      </main>
     </div>
    </>
  )
}

export default Coupon