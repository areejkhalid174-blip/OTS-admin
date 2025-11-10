import React from "react";

import { BsCalendarEvent } from "react-icons/bs";
import { IoCalendarClearOutline } from "react-icons/io5";
import { HiOutlineCube } from "react-icons/hi2";
import { FiUser } from "react-icons/fi";
export default function PaymentManagement() {


  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gape: 10 }}>
        <span>
          <h1>Payment Management</h1>
        </span>
      </div>

      <p>Track and manage all payment transactions</p>

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
                               <h3>TotalRevenue</h3>
                          <BsCalendarEvent />
                  </span>
          <h2>
            $45,231
            <a
              style={{ paddingBottom: 50, paddingtop: 100, paddingLeft: 50 }}
            ></a>
          </h2>
          <p>
            +20.1% from last month
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
           <span  style={{display:"flex",gap:"30px"}}>
                               <h3>PendingPayment</h3>
                         <IoCalendarClearOutline />
                  </span>
          <h2>
            $1,230
            <a
              style={{ paddingBottom: 50, paddingtop: 100, paddingLeft: 50 }}
            ></a>
          </h2>
          <p>
           12 transactions
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
           <span  style={{display:"flex",gap:"40px"}}>
                               <h3>TodayRevenue</h3>
                         <HiOutlineCube />
                  </span>
          <h2>$2,350</h2>
          <p>
            89 transactions
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
                               <h3>SuccessRate</h3>
                         <FiUser />
                  </span>
          <h2>98.5%</h2>
          <p>
            Payment SuccessRate
            <a style={{ paddingBottom: 100 }}></a>
          </p>
        </div>
      </div>

      {/* RECENT ORDERS */}

      <div
        style={{
          width: 1200,
          height: 300,
          backgroundColor: "#f2f2f2",
          borderRadius: 10,
          marginTop:20
        }}
      >
        <h2>Recent Trensactions</h2> 
        <div style={{ backgroundColor: "grey" }}>
          <table className="table mt-5">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Transaction ID</th>
                <th>Actions</th>
                
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>PAY-001</td>
                <td>ORD-001 </td>
                <td>John Doe</td>
                <td>$25.00</td>
                <td>Credit Card</td>
                <td>
                  <span  style={{color:"green"}} class="status completed">completed </span></td>
                <td>2024-01-15</td>
                <td>TXN-12345</td>
                <td>
                  <button class="view-btn">View Details</button>
                </td>
              </tr>
               <tr>
                <td>PAY-002</td>
                <td>ORD-002 </td>
                <td>Jane Smith</td>
                <td>$30.00</td>
                <td>Digital Wallet</td>
                <td>
                  <span  style={{color:"yellow"}} class="status pending">pending </span></td>
                <td>2024-01-14</td>
                <td>TXN-12346</td>
                <td>
                  <button class="view-btn">View Details</button>
                </td>
              </tr>
               <tr>
                <td>PAY-003</td>
                <td>ORD-003 </td>
                <td>Bob Wilson</td>
                <td>$20.00</td>
                <td>Cash</td>
                <td>
                  <span  style={{color:"green"}} class="status completed">completed </span></td>
                <td>2024-01-13</td>
                <td>TXN-12347</td>
                <td>
                  <button class="view-btn">View Details</button>
                </td>
              </tr>
            </tbody>
              
          </table>
        </div>
      </div>
    </div>
  );
}