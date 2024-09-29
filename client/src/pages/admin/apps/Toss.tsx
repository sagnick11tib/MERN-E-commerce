import { useState } from "react"
import AdminSidebar from "../../../components/admin/AdminSidebar"

const Toss = () => {
  const [ angle, setAngel ] = useState<number>(0);

  const flipCoin = () => {
    if (Math.random() > 0.5) setAngel(p => p + 180);
    else setAngel(p => p + 360);
  }
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard-app-container">
        <h1>Toss</h1>
        <section>
          <article
          className="tosscoin"
          onClick={flipCoin}
          style={{transform: `rotateY(${angle}deg)`}}
          >
            <div></div>
            <div></div>
          </article>
        </section>
      </main>
    </div>
  )
}

export default Toss