import React from 'react';
import { 
  FaInfoCircle, 
  FaUsers, 
  FaRocket, 
  FaAward, 
  FaHeart,
  FaShippingFast,
  FaShieldAlt,
  FaMobileAlt,
  FaGlobe,
  FaClock
} from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div style={{ padding: '20px' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#1F2937', 
          marginBottom: '10px' 
        }}>
          About Us
        </h1>
        <p style={{ color: '#6B7280', fontSize: '16px' }}>
          Learn more about ParcelPro and our mission to revolutionize delivery services.
        </p>
      </div>

      {/* Main About Section */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #E5E7EB',
        padding: '40px',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '28px'
          }}>
            <FaInfoCircle />
          </div>
          <div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#1F2937', 
              margin: 0 
            }}>
              Welcome to ParcelPro
            </h2>
            <p style={{ color: '#6B7280', margin: '5px 0 0 0' }}>
              Your Trusted Delivery Partner
            </p>
          </div>
        </div>

        <div style={{ color: '#4B5563', lineHeight: '1.8', fontSize: '16px' }}>
          <p style={{ marginBottom: '20px' }}>
            ParcelPro is a cutting-edge delivery management system designed to streamline and optimize 
            the entire delivery process. We provide a comprehensive platform that connects customers, 
            riders, and administrators in a seamless ecosystem.
          </p>
          <p style={{ marginBottom: '20px' }}>
            Our mission is to revolutionize the delivery industry by providing fast, reliable, and 
            transparent delivery services. We leverage advanced technology to ensure every package 
            reaches its destination safely and on time.
          </p>
          <p>
            With ParcelPro, you can manage orders, track deliveries in real-time, handle payments, 
            and maintain complete control over your delivery operations. We are committed to 
            excellence and customer satisfaction in everything we do.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #E5E7EB',
          padding: '30px',
          textAlign: 'center',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'white',
            fontSize: '24px'
          }}>
            <FaShippingFast />
          </div>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#1F2937', 
            marginBottom: '10px' 
          }}>
            Fast Delivery
          </h3>
          <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6' }}>
            Quick and efficient delivery service ensuring your packages arrive on time, every time.
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #E5E7EB',
          padding: '30px',
          textAlign: 'center',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'white',
            fontSize: '24px'
          }}>
            <FaShieldAlt />
          </div>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#1F2937', 
            marginBottom: '10px' 
          }}>
            Secure & Safe
          </h3>
          <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6' }}>
            Your packages are protected with advanced security measures and real-time tracking.
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #E5E7EB',
          padding: '30px',
          textAlign: 'center',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'white',
            fontSize: '24px'
          }}>
            <FaMobileAlt />
          </div>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#1F2937', 
            marginBottom: '10px' 
          }}>
            Easy to Use
          </h3>
          <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6' }}>
            User-friendly interface that makes managing deliveries simple and intuitive for everyone.
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #E5E7EB',
          padding: '30px',
          textAlign: 'center',
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'white',
            fontSize: '24px'
          }}>
            <FaClock />
          </div>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#1F2937', 
            marginBottom: '10px' 
          }}>
            24/7 Support
          </h3>
          <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6' }}>
            Round-the-clock customer support to assist you whenever you need help.
          </p>
        </div>
      </div>

      {/* Our Values Section */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #E5E7EB',
        padding: '40px',
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#1F2937', 
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FaHeart style={{ color: '#EF4444' }} />
          Our Values
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '25px' 
        }}>
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginBottom: '10px' 
            }}>
              <FaRocket style={{ color: '#667eea', fontSize: '20px' }} />
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1F2937', 
                margin: 0 
              }}>
                Innovation
              </h3>
            </div>
            <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              We constantly innovate to provide the best delivery solutions using cutting-edge technology.
            </p>
          </div>

          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginBottom: '10px' 
            }}>
              <FaUsers style={{ color: '#10B981', fontSize: '20px' }} />
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1F2937', 
                margin: 0 
              }}>
                Customer First
              </h3>
            </div>
            <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              Our customers are at the heart of everything we do. Your satisfaction is our priority.
            </p>
          </div>

          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginBottom: '10px' 
            }}>
              <FaAward style={{ color: '#F59E0B', fontSize: '20px' }} />
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1F2937', 
                margin: 0 
              }}>
                Excellence
              </h3>
            </div>
            <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              We strive for excellence in every aspect of our service delivery and operations.
            </p>
          </div>

          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginBottom: '10px' 
            }}>
              <FaGlobe style={{ color: '#3B82F6', fontSize: '20px' }} />
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1F2937', 
                margin: 0 
              }}>
                Reliability
              </h3>
            </div>
            <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              You can count on us for reliable, consistent, and trustworthy delivery services.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        padding: '40px',
        color: 'white',
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FaRocket />
          Our Mission
        </h2>
        <p style={{ 
          fontSize: '18px', 
          lineHeight: '1.8', 
          opacity: 0.95,
          margin: 0
        }}>
          To transform the delivery industry by providing a seamless, efficient, and transparent 
          platform that connects customers with reliable delivery services. We aim to make 
          package delivery as simple as sending a message, ensuring every delivery is handled 
          with care, speed, and precision.
        </p>
      </div>

      {/* Contact Information */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #E5E7EB',
        padding: '30px'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#1F2937', 
          marginBottom: '20px' 
        }}>
          Get in Touch
        </h2>
        <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '20px' }}>
          Have questions or need assistance? We're here to help!
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px' 
        }}>
          <div>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1F2937', 
              marginBottom: '8px' 
            }}>
              Email
            </h4>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
              support@parcelpro.com
            </p>
          </div>
          <div>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1F2937', 
              marginBottom: '8px' 
            }}>
              Support Hours
            </h4>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
              24/7 Available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

