import AdminSidebar from "../../../components/admin/AdminSidebar"
import { LineChart } from "../../../components/admin/Charts"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]


const Linecharts = () => {
  return (
   <>
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
      <h1>Line Charts</h1>
      <section>
        <LineChart
        labels={months}
        data={[100, 200, 300, 400, 500, 600, 700,888,444,555,666,777]}
        label="Users"
        borderColor="rgb(53,162,255)"
        backgroundColor="rgba(53, 162, 235, 0.5)"
        />
        <h2>Active Users</h2>
      </section>

      <section>
          <LineChart
          data={[50, 100, 150, 200, 250, 300, 350,88,190,290,400,500]}
          backgroundColor={"hsla(269,80%,40%,0.4)"}
          borderColor={"hsl(269,80%,40%)"}
          labels={months}
          label="Products"
          />
        <h2>Total Products (SKU)</h2>
      </section>

      <section>
          <LineChart
          data={[200, 400, 600, 800, 1000, 1200, 1400, 1600, 180, 290, 2200, 2400]}
           backgroundColor={"hsla(129,80%,40%,0.4)"}
                borderColor={"hsl(129,80%,40%)"}
                label="Revenue"
                labels={months}
          />
        <h2>Total Revenue</h2>
      </section>

      <section>
              <LineChart
                data={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100,20,44]}
                backgroundColor={"hsla(29,80%,40%,0.4)"}
                borderColor={"hsl(29,80%,40%)"}
                label="Discount"
                labels={months}
              />
              <h2>Discount Allotted </h2>
            </section>
      </main>
    </div>
   </>
  )
}

export default Linecharts