import React from "react";
import { LuUsers } from "react-icons/lu";
import { LuMessageSquareMore } from "react-icons/lu";
import { FiBell } from "react-icons/fi";
import { CiCalendar } from "react-icons/ci";

export default function CustomerSupport() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gape: 10 }}>
        <span>
          <h1>Customer Support</h1>
        </span>
      </div>

      <p>Manage customer tickets and resolve issues</p>

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
              <span  style={{display:"flex",gap:"60px"}}>
                               <h3>OpenTickets </h3>
                         <LuMessageSquareMore />
                  </span>
          <h1>
            23
            <a
              style={{ paddingBottom: 50, paddingtop: 100, paddingLeft: 50 }}
            ></a>
          </h1>
          <p>
            Awaiting responce
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
           <span  style={{display:"flex",gap:"60px"}}>
                               <h3>In Progress</h3>
                         <FiBell />
                  </span>
          <h1>
            12
            <a
              style={{ paddingBottom: 50, paddingtop: 100, paddingLeft: 50 }}
            ></a>
          </h1>
          <p>
            Being handled
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
                               <h3>ResolvedToday</h3>
                        <LuUsers />
                  </span>
          <h1>45</h1>
          <p>
            Issues resolved
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
                               <h4>AvgResponseTime</h4>
                         <CiCalendar />
                  </span>
          <h1>2.3h</h1>
          <p>
            Average responce
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
        <h2>Rider List</h2> <button class="view-btn"style={{color:"black",paddingleft:50}}>Create Ticket</button>
        <div style={{ backgroundColor: "grey" }}>
          <table className="table mt-5">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Customer</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Order ID</th>
                <th>Created</th>
                <th>Actions</th>
                
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>TIC-001</td>
                <td>John Doe
                 <p> john@example.com</p>
                </td>
                <td>Package not delivered</td>
                <td>Delivery Issue </td>
                <td><span  style={{color:"red"}} class="priority high">high </span></td>
                <td><span  style={{color:"red"}} class="status open">open </span></td>
                <td>ORD-001</td>
                <td>2024-01-15</td>
                <td>
                  <button class="view-btn">View </button>
                </td>
              </tr>
              <tr>
                <td>TIC-002</td>
                <td>Jane Smith
                 <p> jane@example.com</p>
                </td>
                <td>Wrong delivery address</td>
                <td>Address Issue </td>
                <td><span  style={{color:"yellow"}} class="priority medium">medium </span></td>
                <td><span  style={{color:"blue"}} class="status in progress">in progress</span></td>
                <td>ORD-002</td>
                <td>2024-01-14</td>
                <td>
                  <button class="view-btn">View </button>
                </td>
              </tr>
               <tr>
                <td>TIC-003</td>
                <td>Bob Wilson
                 <p> bob@example.com</p>
                </td>
                <td>Payment not processed</td>
                <td>Payment Issue </td>
                <td><span  style={{color:"green"}} class="priority low">low </span></td>
                <td><span  style={{color:"green"}} class="status resolved">resolved </span></td>
                <td>ORD-003</td>
                <td>2024-01-13</td>
                <td>
                  <button class="view-btn">View </button>
                </td>
              </tr>
            </tbody>
              
          </table>
        </div>
      </div>
    </div>
  );
}