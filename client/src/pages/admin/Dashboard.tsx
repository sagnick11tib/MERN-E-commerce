
import { BsSearch } from 'react-icons/bs'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { FaRegBell } from 'react-icons/fa'
import data from "../../assets/data.json"
import { HiTrendingDown, HiTrendingUp } from 'react-icons/hi'
import { BarChart, DoughnutChart } from '../../components/admin/Charts'
import { BiMaleFemale } from 'react-icons/bi'
import DashboardTable from '../../components/admin/DashboardTable'

const Dashboard = () => {
  //const { user } = useSelector((state: RootState) => state.userReducer);
  const img  = "http://res.cloudinary.com/dtr59xel0/image/upload/v1725865544/hmvnbxidwqvzy5lkmwuf.png"
  return (
    <>
    <div className="admin-container">
      <AdminSidebar />
      <main className='dashboard'>
       <div className="bar">
        <BsSearch />
        <input type="text" placeholder="Search for data, users, docs" />
        <FaRegBell />
        <img src={img} alt = "User" />
       </div>
       <section className='widget-container'>  
        <WidgetItem percent={40} amount={true} value={3400000} heading='Revenue' color='rgb(0,115,255)' />
        <WidgetItem percent={-14} value={400} color="rgb(0 198 202)" heading="Users"/>
        <WidgetItem percent={80} value={23000} color="rgb(255 196 0)" heading="Transactions"/>
        <WidgetItem percent={30} value={1000} color="rgb(76 0 255)" heading="Products"/>
       </section>
       <section className='graph-container'>
        <div className="revenue-chart">
          <h2>Revenue & Transaction</h2>
          <BarChart 
            labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]}
            data_1={[100, 200, 300, 400, 500, 600, 700]}
            data_2={[200, 300, 400, 500, 600, 700, 800]}
            title_1="Revenue"
            title_2="Transaction"
            bgColor_1="rgb(0,115,255)"
            bgColor_2="rgba(53, 162, 235, 0.8)"
            />
        </div>
        <div className="dashboard-categories">
          <h2>Inventory</h2>
          <div>
           {
            data.categories.map((item, index)=> (
              <CategoryItem key={index} color={`hsl(${item.value*4},${item.value}%,50%)`} value={item.value} heading={item.heading} />
            ))
           }
          </div>
        </div>
       </section>
       <section className='transaction-container'>
        <div className="gender-chart">
          <h2>Gender Ratio</h2>
          <DoughnutChart labels={["Female","Male"]} data={[40,60]} backgroundColor={[ "hsl(340, 82%, 56%)", "rgba(53, 162, 235, 0.8)"]} cutout={90} />
          <p><BiMaleFemale /></p>
        </div>
        <DashboardTable data={data.transaction} />
       </section>
      </main>
    </div>
    </>
  )
}

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

const WidgetItem = ({
heading,
value,
percent,
color,
amount = false,
}: WidgetItemProps) => <article className='widget'>
<div className="widget-info">
  <p>{heading}</p>
  <h4>{amount ? `₹${value}` : value}</h4>
  {percent > 0 ? (
    <span className='green'>
      <HiTrendingUp /> +{`${percent > 10000 ? 9999 : percent}%`}
    </span>
  ):(<span className='red'>
    <HiTrendingDown /> {`${percent < -10000 ? -9999 : percent}%`}
  </span>)}
</div>
<div className="widget-circle" style={{background: `conic-gradient(${color} ${(Math.abs(percent) / 100) * 360}deg,rgb(255, 255, 255) 0)`,}}>
  <span
  style={{color}}
  >
    {percent > 0 && `${percent > 10000 ? 9999 : percent}%`}
    {percent < 0 && `${percent < -10000 ? -9999 : percent}%`}
  </span>
</div>
</article>

interface CategoryItemProps {
  color: string;
  value: number;
  heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps)=> (
<div className='category-item'>
  <h5>{heading}</h5>
  <div>
    <div style={{backgroundColor: color, width: `${value}%`}}>
    </div>
  </div>
  <span>{value}%</span>
</div>)

export default Dashboard