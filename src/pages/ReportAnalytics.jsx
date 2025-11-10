import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import React from "react";
import { IoCubeOutline } from "react-icons/io5";
import { RiCalendarEventLine } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { FaRegCalendar } from "react-icons/fa6";


const weeklyData = [
  { name: 'Mon', orders: 120, delivered: 110 },
  { name: 'Tue', orders: 140, delivered: 130 },
  { name: 'Wed', orders: 160, delivered: 155 },
  { name: 'Thu', orders: 130, delivered: 125 },
  { name: 'Fri', orders: 180, delivered: 175 },
  { name: 'Sat', orders: 200, delivered: 195 },
  { name: 'Sun', orders: 150, delivered: 145 },
];

const pieData = [
  { name: 'Delivered', value: 65 },
  { name: 'In Transit', value: 20 },
  { name: 'Pending', value: 10 },
  { name: 'Cancelled', value: 5 },
];

const pieColors = ['#00C49F', '#0088FE', '#FFBB28', '#FF4F4F'];

export default function ReportAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <p className="text-gray-500">Comprehensive insights and performance metrics</p>
      </div>

     <div
             style={{
               display: "flex",
               justifyContent: "space-between",
               alignItems: "space-between",
             }}
           >
             <div
               style={{
                 width: 300,
                 height: 150,
                 backgroundColor: "#f2f2f2",
                 borderRadius: 10,
                 paddingLeft:20,
                 paddingTop:20,
               }}
             >
                   <span  style={{display:"flex",gap:"80px"}}>
                                    <h4>TotalOrders</h4>
                              <IoCubeOutline />
                       </span>
               <h2>
                 $12,345
                 <a
                   style={{ paddingBottom: 50, paddingtop: 100, paddingLeft: 50 }}
                 ></a>
               </h2>
               <p>
                 +20% from last month
                 <a style={{ paddingBottom: 100 }}></a>
               </p>
             </div>
             <div
               style={{
                 width: 300,
                 height: 150,
                 backgroundColor: "#f2f2f2",
                 borderRadius: 10,
                 paddingLeft:20,
                 paddingTop:20,
               }}
             >
                <span  style={{display:"flex",gap:"80px"}}>
                                    <h4>Revenue</h4>
                             <RiCalendarEventLine />
                       </span>
               <h2>
                 $145,231
                 <a
                   style={{ paddingBottom: 50, paddingtop: 100, paddingLeft: 50 }}
                 ></a>
               </h2> 
               <p>
                +20.1% from the last
                 <a style={{ paddingBottom: 100 }}></a>
               </p>
             </div>
             <div
               style={{
                 width: 300,
                 height: 150,
                 backgroundColor: "#f2f2f2",
                 borderRadius: 10,
                 paddingLeft:20,
                 paddingTop:20,
               }}
             >
                <span  style={{display:"flex",gap:"80px"}}>
                                    <h4>ActiveUsers</h4>
                             <FiUsers />
                       </span>
               <h2>2,350</h2>
               <p>
                 +180 from last month
                 <a style={{ paddingBottom: 100 }}></a>
               </p>
             </div>
             <div
               style={{
                 width: 300,
                 height: 150,
                 backgroundColor: "#f2f2f2",
                 borderRadius: 10,
                 paddingLeft:20,
                 paddingTop:20,
               }}
             >
                <span  style={{display:"flex",gap:"50px"}}>
                                    <h4>AvgDeliveryTime</h4>
                            <FaRegCalendar />
                       </span>
               <h2>2.4hrs</h2>
               <p>
                 -0.2 hrs from last month
                 <a style={{ paddingBottom: 100 }}></a>
               </p>
             </div>
           </div>
     
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="font-semibold mb-4">Weekly Delivery Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#8884d8" />
              <Line type="monotone" dataKey="delivered" stroke="#00C49F" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="font-semibold mb-4">Order Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index} `} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, growth }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
      <p className="text-xs text-green-600">{growth} from last month</p>
    </div>
  );
}