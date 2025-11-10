import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import { LuLayoutDashboard } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { RiFeedbackLine } from "react-icons/ri";
import { MdPayment } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { IoMdCube } from "react-icons/io";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdPeople } from "react-icons/md";
import { MdCategory } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaCity } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LuLayoutDashboard },
    { path: '/user-management', label: 'User Management', icon: MdPeople, adminOnly: true },
    { path: '/category-management', label: 'Category Management', icon: MdCategory, adminOnly: true },
    { path: '/city-management', label: 'City Management', icon: FaCity, adminOnly: true },
    { path: '/price-management', label: 'Price Management', icon: MdPayment, adminOnly: true },
    { path: '/vehicle-management', label: 'Vehicle Management', icon: FaCar },
    { path: '/delivery-service-management', label: 'Delivery Services', icon: FaTruck, adminOnly: true },
    { path: '/rider-management', label: 'Rider Management', icon: CgProfile },
    { path: '/customer-management', label: 'Customer Management', icon: FaUser },
    { path: '/order-placement', label: 'Order Placement', icon: FaShoppingCart },
    { path: '/OrderManagement', label: 'Order Management', icon: IoMdCube },
    { path: '/PaymentManagement', label: 'Payment Management', icon: MdPayment },
    { path: '/CustomerSupport', label: 'Customer Support', icon: FaRegUser },
    { path: '/FeedbackSystem', label: 'Feedback System', icon: RiFeedbackLine },
    { path: '/ReportAnalytics', label: 'Report Analytics', icon: HiOutlineDocumentReport },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{
      width: 300,
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold' }}>ParcelPro</h2>
        <p style={{ margin: 0, opacity: 0.8 }}>Admin Dashboard</p>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>{user?.name}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>{user?.role}</div>
          </div>
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {menuItems.map((item) => {
          if (item.adminOnly && user?.role !== 'admin') return null;
          
          const IconComponent = item.icon;
          return (
            <li key={item.path} style={{ marginBottom: '5px' }}>
              <Link
                to={item.path}
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  display: 'block'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px 20px',
                  backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}>
                  <div style={{ width: '24px', marginRight: '15px', fontSize: '18px' }}>
                    <IconComponent />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: isActive(item.path) ? '600' : '400' }}>
                    {item.label}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}