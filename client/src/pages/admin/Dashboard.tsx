

import { BsSearch } from 'react-icons/bs'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { FaRegBell } from 'react-icons/fa'
import { HiTrendingDown, HiTrendingUp } from 'react-icons/hi'
import { BarChart, DoughnutChart } from '../../components/admin/Charts'
import { BiMaleFemale } from 'react-icons/bi'
import DashboardTable from '../../components/admin/DashboardTable'
import { useSelector } from 'react-redux'
import { UserReducerInitialState } from '../../types/reducer-types'
import { useStatsQuery } from '../../redux/api/dashboardAPI'
import { Navigate } from 'react-router-dom'
import { Skeleton } from '../../components/Loader'
import { getLastMonths } from '../../utils/features'


const { last6Months: months } = getLastMonths();

const Dashboard = () => {
 
const { user } = useSelector( (state: { userReducer:UserReducerInitialState }) => state.userReducer);

const img  = user?.photo;

const { data, isLoading, isError} = useStatsQuery(user?._id!);

const femaleCount = data?.data?.userRatio?.female ?? 0;
const maleCount = data?.data?.userRatio?.male ?? 0;

if (isError) return <Navigate to={"/"} />;
  return (
    <>
    <div className="admin-container">
      <AdminSidebar />
      <main className='dashboard'>
        {
          isLoading ? (
            <Skeleton length={20} />
          ):(
            <>
               <div className="bar">
        <BsSearch />
        <input type="text" placeholder="Search for data, users, docs" />
        <FaRegBell />
        <img src={img} alt = "User" />
       </div>
       <section className='widget-container'>  
        <WidgetItem percent={data?.data.changePercent.revenue ?? 0} amount={true} value={data?.data.count.revenue ?? 0} heading='Revenue' color='rgb(0,115,255)' />
        <WidgetItem percent={data?.data.changePercent.user ?? 88} value={data?.data.count.user ?? 0} color="rgb(0 198 202)" heading="Users"/>
        <WidgetItem percent={data?.data.changePercent.order ?? 0} value={data?.data.count.order ?? 0} color="rgb(255 196 0)" heading="Transactions"/>
        <WidgetItem percent={data?.data.changePercent.product ?? 0} value={data?.data.count.product ?? 0} color="rgb(76 0 255)" heading="Products"/>
       </section>
       <section className='graph-container'>
        <div className="revenue-chart">
          <h2>Revenue & Transaction</h2>
          <BarChart 
            labels={months}
            data_1={data?.data.chart.revenue ?? []}
            data_2={data?.data.chart.order ?? []}
            title_1="Revenue"
            title_2="Transaction"
            bgColor_1="rgb(0,115,255)"
            bgColor_2="rgba(53, 162, 235, 0.8)"
            />
        </div>
        <div className="dashboard-categories">
          <h2>Inventory</h2>
          <div>
          {data?.data.categoryCount.map((i) => {
                    const [heading, value] = Object.entries(i)[0];
                    return (
                      <CategoryItem
                        key={heading}
                        value={value}
                        heading={heading}
                        color={`hsl(${value * 4}, ${value}%, 50%)`}
                      />
                    );
                  })}
          </div>
        </div>
       </section>
       <section className='transaction-container'>
        <div className="gender-chart">
          <h2>Gender Ratio</h2>
          <DoughnutChart labels={["Female","Male"]} data={[femaleCount, maleCount]} backgroundColor={[ "hsl(340, 82%, 56%)", "rgba(53, 162, 235, 0.8)"]} cutout={90} />
          <p><BiMaleFemale /></p>
        </div>
        <DashboardTable data={data?.data.latestTransaction ?? []} />
       </section>
            </>
          )
        }
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
