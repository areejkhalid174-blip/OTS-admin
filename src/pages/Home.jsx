import React from "react";
import { CgEnter } from "react-icons/cg";
import { IoMdCube } from "react-icons/io";

export default function Home() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gape: 10 }}>
        <span>
          <h1>OrdersManagement</h1>
        </span>
      </div>

      <p>Manage customer orders and track delivery ststus</p>

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
          }}
        >
          {/* <div>
                       <IoMdCube />
           </div>   */}
          <h2>Total Orders</h2>
          <h1>
            1234
            <a
              style={{ paddingBottom: 50, paddingtop: 100, paddingLeft: 50 }}
            ></a>
          </h1>
          <p>
            +12% from last month
            <a style={{ paddingBottom: 100 }}></a>
          </p>
        </div>
        <div
          style={{
            width: 300,
            height: 150,
            backgroundColor: "#f2f2f2",
            borderRadius: 10,
          }}
        >
          <h2>Pending Orders</h2>
          <h1>
            23
            <a
              style={{ paddingBottom: 50, paddingtop: 100, paddingLeft: 50 }}
            ></a>
          </h1>
          <p>
            Awaiting assignment
            <a style={{ paddingBottom: 100 }}></a>
          </p>
        </div>
        <div
          style={{
            width: 300,
            height: 150,
            backgroundColor: "#f2f2f2",
            borderRadius: 10,
          }}
        >
          <h2>In Transit</h2>
          <h1>45</h1>
          <p>
            Currently delivering
            <a style={{ paddingBottom: 100 }}></a>
          </p>
        </div>
        <div
          style={{
            width: 300,
            height: 150,
            backgroundColor: "#f2f2f2",
            borderRadius: 10,
          }}
        >
          <h2>Delivered Today</h2>
          <h1>89</h1>
          <p>
            +8% from yesterday
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
        <h2>Recent Orders</h2>
        <div style={{ backgroundColor: "grey" }}>
          <table className="table mt-5">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Pickup Location</th>
                <th>Delivery Location</th>
                <th>Status</th>
                <th>Rider</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ORD-001</td>
                <td>John Doe</td>
                <td>123 Main St, City A</td>
                <td>456 Oak Ave, City B</td>
                <td>
                  <span  style={{color:"red"}}class="status pending">pending</span>
                </td>
                <td>Not Assigned</td>
                <td>$25.00</td>
                <td>
                  <button class="view-btn">View Details</button>
                </td>
              </tr>
              <tr>
                <td>ORD-002</td>
                <td>Jane Smith</td>
                <td>789 Pine Rd, City C</td>
                <td>321 Elm St, City D</td>
                <td>
                  <span style={{color:"blue"}} class="status in-transit">in-transit</span>
                </td>
                <td>Mike Johnson</td>
                <td>$30.00</td>
                <td>
                  <button class="view-btn">View Details</button>
                </td>
              </tr>
              <tr>
                <td>ORD-003</td>
                <td>Bob Wilson</td>
                <td>555 Cedar Ln, City E</td>
                <td>888 Birch Dr, City F</td>
                <td>
                  <span style={{color:"green"}} class="status delivered">delivered</span>
                </td>
                <td>Sarah Davis</td>
                <td>$20.00</td>
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