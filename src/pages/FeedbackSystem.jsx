import React from "react";
import { IoMdCube } from "react-icons/io";
import { LiaUserSolid } from "react-icons/lia";
import { CiLocationOn } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";

export default function FeedbackSystem() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gape: 10 }}>
        <span>
          <h1>Feedback System</h1>
        </span>
      </div>

      <p>Monitor customer feedback and iprove service quality</p>

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
                               <h3>AverageRating</h3>
                          <LiaUserSolid />
                  </span>
          <h1>
            4.2
            <a
              style={{ paddingBottom: 50, paddingtop: 100, paddingLeft: 50 }}
            ></a>
          </h1>
          <p>
            out of 5.0 stars
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
                               <h3>TotalsReviews</h3>
                         <CiLocationOn />
                  </span>
          <h1>
            1,247
            <a
              style={{ paddingBottom: 50, paddingtop: 100, paddingLeft: 50 }}
            ></a>
          </h1>
          <p>
            +15 this week
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
                               <h3>PendingReviews</h3>
                         <IoMdCube />
                  </span>
          <h1>8</h1>
          <p>
            Need attention
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
                               <h3>5StarsReviews</h3>
                         <CiCalendar />
                  </span>
          <h1>67%</h1>
          <p>
            Of total reviews
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
        <h2>Rider List</h2> <button class="view-btn"style={{color:"black",paddingleft:50}}>Recent Feedback</button>
        <div style={{ backgroundColor: "grey" }}>
          <table className="table mt-5">
            <thead>
              <tr>
                <th>Feedback ID</th>
                <th>Customer</th>
                <th>Order ID</th>
                <th>Rider</th>
                <th>Rating</th>
                <th>Category</th>
                <th>Comment </th>
                <th>Status</th>
                <th>Date</th>
                
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>FB-001</td>
                <td>John Doe </td>
                <td>ORD-001</td>
                <td>Mike JOHSON</td>
                <td>(5)</td>
                <td>Delivery</td>
                <td>Excellent service! Package delivered...</td>
                <td> <td><span  style={{color:"green"}} class="Status reviewed">reviewed </span></td></td>
                <td>2024-01-15</td>
              </tr>
               <tr>
                <td>FB-002</td>
                <td>Jane Smith </td>
                <td>ORD-002</td>
                <td>Sarah Davis</td>
                <td>(4)</td>
                <td>Timeliness</td>
                <td>Good service but therider was a bit la...</td>
                <td> <td><span  style={{color:"yellow"}} class="Status pending">pending </span></td></td>
                <td>2024-01-14</td>
              </tr>
               <tr>
                <td>FB-003</td>
                <td>Bob Wilson </td>
                <td>ORD-003</td>
                <td>Tom Willson</td>
                <td>(3)</td>
                <td>Package Handling</td>
                <td>Package was damaged during deliver...</td>
                <td> <td><span  style={{color:"red"}} class="Status action required"> action required</span></td></td>
                <td>2024-01-15</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}